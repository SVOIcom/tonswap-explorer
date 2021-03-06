-- MySQL dump 10.13  Distrib 5.7.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tonswap_explorer
-- ------------------------------------------------------
-- Server version	5.7.34-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `provide_liquidity_events`
--

DROP TABLE IF EXISTS `provide_liquidity_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provide_liquidity_events` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tx_id` char(64) DEFAULT NULL,
  `swap_pair_id` int(10) DEFAULT NULL,
  `first_token_amount` double DEFAULT NULL,
  `second_token_amount` double DEFAULT NULL,
  `lp_tokens_minted` double DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tx_id_UNIQUE` (`tx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smart_contract_addresses`
--

DROP TABLE IF EXISTS `smart_contract_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smart_contract_addresses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `smart_contract_type` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `address_UNIQUE` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `swap_events`
--

DROP TABLE IF EXISTS `swap_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `swap_events` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tx_id` char(64) DEFAULT NULL,
  `swap_pair_id` int(10) DEFAULT NULL,
  `provided_token_root` char(66) DEFAULT NULL,
  `target_token_root` char(66) DEFAULT NULL,
  `tokens_used_for_swap` double DEFAULT NULL,
  `tokens_received` double DEFAULT NULL,
  `fee` double DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tx_id_UNIQUE` (`tx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `swap_pair_events`
--

DROP TABLE IF EXISTS `swap_pair_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `swap_pair_events` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `swap_pair_id` int(10) DEFAULT NULL,
  `tx_id` char(64) CHARACTER SET latin1 DEFAULT NULL,
  `event_type` int(10) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tx_id_UNIQUE` (`tx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `swap_pair_information`
--

DROP TABLE IF EXISTS `swap_pair_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `swap_pair_information` (
  `id` int(10) NOT NULL,
  `swap_pair_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `root_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `token1_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `token2_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `lptoken_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `wallet1_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `wallet2_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `lptoken_wallet_address` char(66) CHARACTER SET latin1 DEFAULT NULL,
  `swap_pair_name` char(200) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `swap_pair_liquidity_pools`
--

DROP TABLE IF EXISTS `swap_pair_liquidity_pools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `swap_pair_liquidity_pools` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `swap_pair_id` int(10) DEFAULT NULL,
  `liquidity_pool_1` double DEFAULT NULL,
  `liquidity_pool_2` double DEFAULT NULL,
  `lp_tokens_amount` double DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `withdraw_liquidity_events`
--

DROP TABLE IF EXISTS `withdraw_liquidity_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `withdraw_liquidity_events` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tx_id` char(64) DEFAULT NULL,
  `swap_pair_id` int(10) DEFAULT NULL,
  `first_token_amount` double DEFAULT NULL,
  `second_token_amount` double DEFAULT NULL,
  `lp_tokens_burnt` double DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tx_id_UNIQUE` (`tx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-04 16:42:24
