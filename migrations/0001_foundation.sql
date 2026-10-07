PRAGMA foreign_keys = ON;
CREATE TABLE owners (id TEXT PRIMARY KEY, created_at TEXT NOT NULL);
CREATE TABLE devices (owner_id TEXT NOT NULL REFERENCES owners(id), id TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(owner_id,id));
CREATE TABLE access_sessions (token_hash TEXT PRIMARY KEY, owner_id TEXT NOT NULL, device_id TEXT NOT NULL, expires_at INTEGER NOT NULL, FOREIGN KEY(owner_id,device_id) REFERENCES devices(owner_id,id));
CREATE INDEX access_sessions_owner ON access_sessions(owner_id,device_id);
CREATE TABLE login_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX login_limits_expiry ON login_limits(expires_at);
CREATE TABLE facts (
 cursor INTEGER PRIMARY KEY AUTOINCREMENT, owner_id TEXT NOT NULL, id TEXT NOT NULL,
 device_id TEXT NOT NULL, sequence INTEGER NOT NULL CHECK(sequence > 0), kind TEXT NOT NULL,
 entity_id TEXT NOT NULL, base_revision TEXT, schema_version INTEGER NOT NULL CHECK(schema_version=1),
 occurred_at TEXT NOT NULL, received_at TEXT NOT NULL, content_hash TEXT NOT NULL, body TEXT NOT NULL,
 UNIQUE(owner_id,id), UNIQUE(owner_id,device_id,sequence),
 FOREIGN KEY(owner_id,device_id) REFERENCES devices(owner_id,id),
 FOREIGN KEY(owner_id,entity_id) REFERENCES facts(owner_id,id) DEFERRABLE INITIALLY DEFERRED,
 FOREIGN KEY(owner_id,base_revision) REFERENCES facts(owner_id,id) DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX facts_download ON facts(owner_id,cursor);
CREATE INDEX facts_revisions ON facts(owner_id,entity_id,base_revision);
CREATE TABLE fact_references (
 owner_id TEXT NOT NULL, fact_id TEXT NOT NULL, target_id TEXT NOT NULL,
 PRIMARY KEY(owner_id,fact_id,target_id),
 FOREIGN KEY(owner_id,fact_id) REFERENCES facts(owner_id,id) DEFERRABLE INITIALLY DEFERRED,
 FOREIGN KEY(owner_id,target_id) REFERENCES facts(owner_id,id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE sync_receipts (owner_id TEXT NOT NULL REFERENCES owners(id), id TEXT NOT NULL, content_hash TEXT NOT NULL, received_at TEXT NOT NULL, PRIMARY KEY(owner_id,id));
-- Fail the whole transaction if a retry reuses an ID with different content.
CREATE TRIGGER immutable_fact BEFORE UPDATE ON facts WHEN OLD.content_hash <> NEW.content_hash BEGIN SELECT RAISE(ABORT,'fact_conflict'); END;
CREATE TRIGGER immutable_receipt BEFORE UPDATE ON sync_receipts WHEN OLD.content_hash <> NEW.content_hash BEGIN SELECT RAISE(ABORT,'receipt_conflict'); END;
