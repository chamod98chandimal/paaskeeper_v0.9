/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface VaultStorageInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createEntry"
      | "deleteEntry"
      | "getEntry"
      | "getUserEntryCount"
      | "updateEntry"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "EntryCreated" | "EntryDeleted" | "EntryUpdated"
  ): EventFragment;

  encodeFunctionData(functionFragment: "createEntry", values: [string]): string;
  encodeFunctionData(
    functionFragment: "deleteEntry",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEntry",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserEntryCount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateEntry",
    values: [BigNumberish, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "createEntry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteEntry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getEntry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUserEntryCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateEntry",
    data: BytesLike
  ): Result;
}

export namespace EntryCreatedEvent {
  export type InputTuple = [user: AddressLike, entryId: BigNumberish];
  export type OutputTuple = [user: string, entryId: bigint];
  export interface OutputObject {
    user: string;
    entryId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EntryDeletedEvent {
  export type InputTuple = [user: AddressLike, entryId: BigNumberish];
  export type OutputTuple = [user: string, entryId: bigint];
  export interface OutputObject {
    user: string;
    entryId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EntryUpdatedEvent {
  export type InputTuple = [user: AddressLike, entryId: BigNumberish];
  export type OutputTuple = [user: string, entryId: bigint];
  export interface OutputObject {
    user: string;
    entryId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface VaultStorage extends BaseContract {
  connect(runner?: ContractRunner | null): VaultStorage;
  waitForDeployment(): Promise<this>;

  interface: VaultStorageInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  createEntry: TypedContractMethod<
    [encryptedData: string],
    [void],
    "nonpayable"
  >;

  deleteEntry: TypedContractMethod<
    [entryId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEntry: TypedContractMethod<[entryId: BigNumberish], [string], "view">;

  getUserEntryCount: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  updateEntry: TypedContractMethod<
    [entryId: BigNumberish, newEncryptedData: string],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createEntry"
  ): TypedContractMethod<[encryptedData: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "deleteEntry"
  ): TypedContractMethod<[entryId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getEntry"
  ): TypedContractMethod<[entryId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getUserEntryCount"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "updateEntry"
  ): TypedContractMethod<
    [entryId: BigNumberish, newEncryptedData: string],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "EntryCreated"
  ): TypedContractEvent<
    EntryCreatedEvent.InputTuple,
    EntryCreatedEvent.OutputTuple,
    EntryCreatedEvent.OutputObject
  >;
  getEvent(
    key: "EntryDeleted"
  ): TypedContractEvent<
    EntryDeletedEvent.InputTuple,
    EntryDeletedEvent.OutputTuple,
    EntryDeletedEvent.OutputObject
  >;
  getEvent(
    key: "EntryUpdated"
  ): TypedContractEvent<
    EntryUpdatedEvent.InputTuple,
    EntryUpdatedEvent.OutputTuple,
    EntryUpdatedEvent.OutputObject
  >;

  filters: {
    "EntryCreated(address,uint256)": TypedContractEvent<
      EntryCreatedEvent.InputTuple,
      EntryCreatedEvent.OutputTuple,
      EntryCreatedEvent.OutputObject
    >;
    EntryCreated: TypedContractEvent<
      EntryCreatedEvent.InputTuple,
      EntryCreatedEvent.OutputTuple,
      EntryCreatedEvent.OutputObject
    >;

    "EntryDeleted(address,uint256)": TypedContractEvent<
      EntryDeletedEvent.InputTuple,
      EntryDeletedEvent.OutputTuple,
      EntryDeletedEvent.OutputObject
    >;
    EntryDeleted: TypedContractEvent<
      EntryDeletedEvent.InputTuple,
      EntryDeletedEvent.OutputTuple,
      EntryDeletedEvent.OutputObject
    >;

    "EntryUpdated(address,uint256)": TypedContractEvent<
      EntryUpdatedEvent.InputTuple,
      EntryUpdatedEvent.OutputTuple,
      EntryUpdatedEvent.OutputObject
    >;
    EntryUpdated: TypedContractEvent<
      EntryUpdatedEvent.InputTuple,
      EntryUpdatedEvent.OutputTuple,
      EntryUpdatedEvent.OutputObject
    >;
  };
}
