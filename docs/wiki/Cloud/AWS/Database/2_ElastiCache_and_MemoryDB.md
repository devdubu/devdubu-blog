# Amazon ElastiCache & MemoryDB

## 1. Amazon ElastiCache
**Amazon ElastiCache** is a fully managed in-memory caching service, supporting **Redis** and **Memcached**. It improves application performance by retrieving data from fast, managed, in-memory caches, reducing latency to microseconds.

### Engines: Redis vs Memcached
| Feature | Redis | Memcached |
| :--- | :--- | :--- |
| **Data Structures** | Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps | Simple Strings (Key-Value) |
| **Persistence** | Yes (AOF/RDB) | No (Pure Cache) |
| **Replication** | Yes (Master-Slave) | No |
| **High Availability** | Multi-AZ, Auto Failover | No (Node failure = Data loss) |
| **Pub/Sub** | Yes | No |
| **Use Case** | Complex data, Leaderboards, Caching with persistence | Simple Caching, Multithreading needed |

### Architecture Modes (Redis)
- **Cluster Mode Disabled**:
    - 1 Shard (1 Primary + up to 5 Replicas).
    - Good for smaller workloads where data fits in one node.
- **Cluster Mode Enabled**:
    - Up to 500 Shards.
    - Data partitioned across shards.
    - High scalability for write throughput and storage.

---

## 2. Amazon MemoryDB for Redis
**Amazon MemoryDB** is a Redis-compatible, durable, in-memory database service that delivers ultra-fast performance. Unlike ElastiCache (which is primarily a cache), MemoryDB is designed to be a **primary database**.

### Key Features
- **Durability**: Uses a Multi-AZ Transaction Log to store data durably across multiple AZs.
- **Performance**: Microsecond reads, single-digit millisecond writes.
- **Consistency**: **Strong Consistency** for Primary, Eventual Consistency for Replicas.
- **Compatibility**: Fully compatible with Redis API and data structures.

### Architecture
- **Shards**: 1 to 500 shards per cluster.
- **Nodes**: Each shard has 1 Primary + up to 5 Replicas.
- **Persistence**: Data is stored in memory and durably persisted to the customized transaction log.

---

## 3. Caching Strategies
Deciding what to cache depends on speed requirements, cost, and access patterns.
- **Speed**: Cache data that is slow/expensive to query (e.g., complex joins).
- **Access Pattern**: Cache frequently accessed, relatively static data (e.g., user profiles).
- **Staleness**: Determine tolerable staleness (e.g., stock prices vs profile names).

### Data Tiering (Redis)
For cost optimization, use **Data Tiering** (r6gd nodes) to move least frequently used (LRU) data from Memory (DRAM) to local SSDs.
- **Benefit**: Store more data at lower cost.
- **Performance Impact**: Slight latency increase for data on SSD (~300µs).

---

## 4. Use Cases
- **In-Memory Caching**: DB query results, API responses.
- **Session Store**: User session management.
- **Real-time Analytics**: Leaderboards, Counting.
- **Pub/Sub**: Real-time messaging (Chat, Notifications).
    - Commands: `SUBSCRIBE`, `PUBLISH`, `PSUBSCRIBE` (pattern matching).

---

## 5. Security
- **Network**: Run in VPC Private Subnets.
- **Encryption**: TLS for transit, KMS for rest.
- **Authentication**: Redis `AUTH` or IAM Authentication (MemoryDB).
- **Access Control**: Security Groups (Default Port: **6379**).
