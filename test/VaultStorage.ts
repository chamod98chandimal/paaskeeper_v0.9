import { ethers } from "hardhat";
import { expect } from "chai";

describe("VaultStorage", function () {
  let vault: any;
  let owner: any;

  beforeEach(async () => {
    const VaultStorage = await ethers.getContractFactory("VaultStorage");
    vault = await VaultStorage.deploy();
    await vault.deployed();

    [owner] = await ethers.getSigners();
  });

  it("should create an entry", async () => {
    const data = "encrypted_password";
    const tx = await vault.createEntry(data);
    await tx.wait();

    const stored = await vault.getEntry(0);
    expect(stored).to.equal(data);
  });

  it("should update an entry", async () => {
    await vault.createEntry("original_data");
    const tx = await vault.updateEntry(0, "updated_data");
    await tx.wait();

    const updated = await vault.getEntry(0);
    expect(updated).to.equal("updated_data");
  });

  it("should delete an entry", async () => {
    await vault.createEntry("to_be_deleted");
    const tx = await vault.deleteEntry(0);
    await tx.wait();

    await expect(vault.getEntry(0)).to.be.reverted;
  });
});
