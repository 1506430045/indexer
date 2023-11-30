// @ts-ignore
// @ts-ignore
import { logger } from "@/common/logger";

export const config = {
  version: String(process.env.VERSION),
  port: Number(process.env.PORT),
  chainId: Number(process.env.CHAIN_ID),
  environment: String(process.env.ENVIRONMENT),

  adminApiKey: String(process.env.ADMIN_API_KEY),
  bullmqAdminPassword: String(process.env.BULLMQ_ADMIN_PASSWORD),
  arweaveRelayerKey: process.env.ARWEAVE_RELAYER_KEY
    ? String(process.env.ARWEAVE_RELAYER_KEY)
    : undefined,
  oraclePrivateKey: String(process.env.ORACLE_PRIVATE_KEY),
  oracleAwsKmsKeyId: String(process.env.ORACLE_AWS_KMS_KEY_ID),
  oracleAwsKmsKeyRegion: String(process.env.ORACLE_AWS_KMS_KEY_REGION),

  baseNetworkHttpUrl: String(process.env.BASE_NETWORK_HTTP_URL),
  baseNetworkWsUrl: String(process.env.BASE_NETWORK_WS_URL),
  traceNetworkHttpUrl: String(
    process.env.TRACE_NETWORK_HTTP_URL ?? process.env.BASE_NETWORK_HTTP_URL
  ),
  openseaIndexerApiBaseUrl: String(process.env.OPENSEA_INDEXER_API_BASE_URL),

  // When running in liquidity-only mode, all metadata processes are disabled
  liquidityOnly: !process.env.METADATA_API_BASE_URL,
  metadataIndexingMethod: String(process.env.METADATA_INDEXING_METHOD || "opensea"),
  metadataIndexingMethodCollection: String(
    process.env.METADATA_INDEXING_METHOD_COLLECTION ||
      process.env.METADATA_INDEXING_METHOD ||
      "opensea"
  ),
  metadataApiBaseUrl: String(process.env.METADATA_API_BASE_URL),

  disableRealtimeMetadataRefresh: Boolean(Number(process.env.DISABLE_REALTIME_METADATA_REFRESH)),

  databaseUrl: String(process.env.DATABASE_URL),
  disableDatabaseStatementTimeout: Boolean(Number(process.env.DATABASE_DISABLE_STATEMENT_TIMEOUT)),
  readReplicaDatabaseUrl: String(process.env.READ_REPLICA_DATABASE_URL || process.env.DATABASE_URL),
  writeReplicaDatabaseUrl: String(
    process.env.WRITE_REPLICA_DATABASE_URL || process.env.DATABASE_URL
  ),
  redisUrl: String(process.env.REDIS_URL),
  rateLimitRedisUrl: String(process.env.RATE_LIMIT_REDIS_URL || process.env.REDIS_URL),
  redisWebsocketUrl: String(process.env.REDIS_WEBSOCKET_URL || process.env.REDIS_URL),
  metricsRedisUrl: String(process.env.METRICS_REDIS_URL || process.env.REDIS_URL),
  allChainsSyncRedisUrl: String(process.env.ALL_CHAINS_SYNC_REDIS_URL || process.env.REDIS_URL),
  redshiftUrl: String(process.env.REDSHIFT_URL),

  master: Boolean(Number(process.env.MASTER)),
  catchup: Boolean(Number(process.env.CATCHUP)),
  doBackgroundWork: Boolean(Number(process.env.DO_BACKGROUND_WORK)),
  doWebsocketWork: Boolean(Number(process.env.DO_WEBSOCKET_WORK)),
  doWebsocketServerWork: Boolean(Number(process.env.DO_WEBSOCKET_SERVER_WORK)),
  doEventsSyncBackfill: Boolean(Number(process.env.DO_EVENTS_SYNC_BACKFILL)),
  disableOrders: Boolean(Number(process.env.DISABLE_ORDERS)),

  // for kafka
  doKafkaWork: Boolean(Number(process.env.DO_KAFKA_WORK)),
  kafkaPartitionsConsumedConcurrently: Number(process.env.KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY),
  kafkaConsumerGroupId: String(process.env.KAFKA_CONSUMER_GROUP_ID),
  kafkaBrokers: process.env.KAFKA_BROKERS ? String(process.env.KAFKA_BROKERS).split(",") : [],
  kafkaClientId: String(process.env.KAFKA_CLIENT_ID),
  kafkaMaxBytesPerPartition: Number(process.env.KAFKA_MAX_BYTES_PER_PARTITION),

  maxTokenSetSize: 100000,

  awsAccessKeyId: String(process.env.AWS_ACCESS_KEY_ID || process.env.FC_AWS_ACCESS_KEY_ID),
  awsSecretAccessKey: String(
    process.env.AWS_SECRET_ACCESS_KEY || process.env.FC_AWS_SECRET_ACCESS_KEY
  ),

  dataExportS3BucketName: String(process.env.DATA_EXPORT_S3_BUCKET_NAME),
  dataExportAwsAccessRole: String(process.env.DATA_EXPORT_AWS_ACCESS_ROLE),
  dataExportAwsS3UploadRole: String(process.env.DATA_EXPORT_AWS_S3_UPLOAD_ROLE),
  dataExportAwsS3UploadExternalId: String(process.env.DATA_EXPORT_AWS_S3_UPLOAD_EXTERNAL_ID),
  dataExportS3ArchiveBucketName: process.env.DATA_EXPORT_S3_ARCHIVE_BUCKET_NAME
    ? String(process.env.DATA_EXPORT_S3_ARCHIVE_BUCKET_NAME)
    : undefined,

  // For forwarding orders to OpenSea
  forwardOpenseaApiKey: String(process.env.FORWARD_OPENSEA_API_KEY),
  forwardReservoirApiKeys: process.env.FORWARD_RESERVOIR_API_KEYS
    ? (JSON.parse(process.env.FORWARD_RESERVOIR_API_KEYS) as string[])
    : [],

  looksRareApiKey: String(process.env.LOOKSRARE_API_KEY),
  openSeaApiKey: String(process.env.OPENSEA_API_KEY),
  openSeaApiUrl: String(process.env.OPENSEA_API_URL || ""),

  openSeaCrossPostingApiKey: String(
    process.env.OPENSEA_CROSS_POSTING_API_KEY || process.env.OPENSEA_API_KEY
  ),

  x2y2ApiKey: String(process.env.X2Y2_API_KEY),
  cbApiKey: String(process.env.CB_API_KEY),
  orderFetcherApiKey: String(process.env.ORDER_FETCHER_API_KEY),

  blurWsApiKey: process.env.BLUR_WS_API_KEY,
  blurWsUrl: process.env.BLUR_WS_URL,
  blurWsListingsUrl: process.env.BLUR_LISTINGS_WS_URL,

  orderFetcherBaseUrl: String(process.env.ORDER_FETCHER_BASE_URL),

  cipherSecret: String(process.env.CIPHER_SECRET),
  imageTag: String(process.env.IMAGE_TAG),

  slackApiKeyWebhookUrl: String(process.env.SLACK_API_KEY_WEBHOOK_URL),

  maxParallelTokenRefreshJobs: Number(process.env.MAX_PARALLEL_TOKEN_REFRESH_JOBS || 1),
  maxParallelTokenCollectionSlugRefreshJobs: Number(
    process.env.MAX_PARALLEL_TOKEN_COLLECTION_SLUG_REFRESH_JOBS || 1
  ),

  // Backfilling
  doFtTransfersWrite: Boolean(Number(process.env.DO_FT_TRANSFERS_WRITE)),
  doNftTransfersWrite: Boolean(Number(process.env.DO_NFT_TRANSFERS_WRITE)),
  doProcessBackfilling: Boolean(Number(process.env.DO_PROCESS_BACKFILLING)),
  doProcessRealtime: Boolean(Number(process.env.DO_PROCESS_REALTIME)),

  enableDebug: Boolean(Number(process.env.ENABLE_DEBUG)),

  // Elasticsearch
  elasticsearchUrl: String(process.env.ELASTICSEARCH_URL || ""),
  doElasticsearchWork: Boolean(Number(process.env.DO_ELASTICSEARCH_WORK)),

  // RabbitMq
  rabbitMqUrl: `amqp://${String(process.env.RABBIT_URL)}:5672`,
  rabbitHttpUrl: `http://${String(process.env.RABBIT_URL)}:15672`,
  rabbitHostname: String(process.env.RABBIT_HOSTNAME),
  rabbitUsername: String(process.env.RABBIT_USERNAME),
  rabbitPassword: String(process.env.RABBIT_PASSWORD),
  rabbitDisableQueuesConsuming: Boolean(Number(process.env.RABBIT_DISABLE_QUEUES_CONSUMING)),
  forceEnableRabbitJobsConsumer: Boolean(Number(process.env.FORCE_ENABLE_RABBIT_JOBS_CONSUMER)),
  networkBaseUrlList: [
    { url: "https://opbnb-mainnet.nodereal.io/v1/6b12d198f6b343ea9fdd53db77c66d06", weight: 1500 },
    { url: "https://opbnb-mainnet.nodereal.io/v1/cf8d5aa243bc4eb7b63c2dca6673d281", weight: 300 },
    { url: "https://opbnb-mainnet.nodereal.io/v1/34f5274ae22f44cd88739a067d4d9a26", weight: 300 },
    { url: "https://opbnb-mainnet.nodereal.io/v1/0601375725ad4c9f8273d193de68cd5f", weight: 300 },
    { url: "https://opbnb-mainnet.nodereal.io/v1/914171a9bcd741fda010cb7cc5a7113d", weight: 300 },
    { url: "https://opbnb-mainnet.nodereal.io/v1/23823ed4d16e4a8984a1ae11fb21135a", weight: 300 },
  ],
  wsNetworkBaseUrlList: [
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/6b12d198f6b343ea9fdd53db77c66d06", weight: 1500 },
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/cf8d5aa243bc4eb7b63c2dca6673d281", weight: 300 },
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/34f5274ae22f44cd88739a067d4d9a26", weight: 300 },
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/0601375725ad4c9f8273d193de68cd5f", weight: 300 },
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/914171a9bcd741fda010cb7cc5a7113d", weight: 300 },
    { url: "wss://opbnb-mainnet.nodereal.io/ws/v1/23823ed4d16e4a8984a1ae11fb21135a", weight: 300 },
  ]
};

let callCount = 0;

// 每秒调用一次的方法
function countGetNetworkBaseUrl() {
  var currentTime = new Date();
  var formattedTime = currentTime.toLocaleTimeString();
  console.log(`countGetNetworkBaseUrl Total calls: ${callCount} ${formattedTime}`);
  callCount = 0; // 重置调用次数
}

// 设置每秒调用一次 myMethod 方法
setInterval(countGetNetworkBaseUrl, 1000);

export function getNetworkBaseUrl() {
  return "https://opbnb-mainnet-rpc.bnbchain.org"
  callCount++
  const totalWeight = config.networkBaseUrlList.reduce((sum, entry) => sum + entry.weight, 0);

  let randomWeight = Math.random() * totalWeight;
  for (const entry of config.networkBaseUrlList) {
    randomWeight -= entry.weight;
    if (randomWeight <= 0) {
      // 返回被选中的URL
      // var url = entry.url
      // var currentTime = new Date();
      // var formattedTime = currentTime.toLocaleTimeString();
      // console.log(`get-network-url: ${url} ${formattedTime}`)
      return entry.url;
    }
  }

  // 如果所有URL的权重都是0，或者发生其他问题，返回数组的第一个URL
  return config.networkBaseUrlList[0].url;
}

export function getWsNetworkBaseUrl() {
  const totalWeight = config.wsNetworkBaseUrlList.reduce((sum, entry) => sum + entry.weight, 0);

  let randomWeight = Math.random() * totalWeight;
  for (const entry of config.wsNetworkBaseUrlList) {
    randomWeight -= entry.weight;
    if (randomWeight <= 0) {
      // 返回被选中的URL
      var url = entry.url
      var currentTime = new Date();
      var formattedTime = currentTime.toLocaleTimeString();
      console.log(`get-ws-network-url: ${url} ${formattedTime}`)
      return entry.url;
    }
  }

  // 如果所有URL的权重都是0，或者发生其他问题，返回数组的第一个URL
  return config.wsNetworkBaseUrlList[0].url;
}