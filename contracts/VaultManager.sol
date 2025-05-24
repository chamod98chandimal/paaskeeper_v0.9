// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VaultStorage {
    struct VaultEntry {
        string data;       // Encrypted data (letters, numbers, symbols)
        bool exists;
    }

    mapping(address => mapping(uint256 => VaultEntry)) private vaults;
    mapping(address => uint256) private userEntryCount;

    event EntryCreated(address indexed user, uint256 entryId);
    event EntryUpdated(address indexed user, uint256 entryId);
    event EntryDeleted(address indexed user, uint256 entryId);

    // Create a new vault entry
    function createEntry(string memory encryptedData) public {
        uint256 entryId = userEntryCount[msg.sender];
        vaults[msg.sender][entryId] = VaultEntry({
            data: encryptedData,
            exists: true
        });
        userEntryCount[msg.sender]++;
        emit EntryCreated(msg.sender, entryId);
    }

    // Read a vault entry
    function getEntry(uint256 entryId) public view returns (string memory) {
        require(vaults[msg.sender][entryId].exists, "Entry does not exist");
        return vaults[msg.sender][entryId].data;
    }

    // Update an existing vault entry
    function updateEntry(uint256 entryId, string memory newEncryptedData) public {
        require(vaults[msg.sender][entryId].exists, "Entry does not exist");
        vaults[msg.sender][entryId].data = newEncryptedData;
        emit EntryUpdated(msg.sender, entryId);
    }

    // Delete an existing vault entry
    function deleteEntry(uint256 entryId) public {
        require(vaults[msg.sender][entryId].exists, "Entry does not exist");
        delete vaults[msg.sender][entryId];
        emit EntryDeleted(msg.sender, entryId);
    }

    // Get number of entries by user
    function getUserEntryCount(address user) public view returns (uint256) {
        return userEntryCount[user];
    }
}
