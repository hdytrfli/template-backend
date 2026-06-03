export abstract class Database {
  readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract healthcheck(): Promise<boolean>;
}
