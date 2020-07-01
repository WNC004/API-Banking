CREATE DATABASE  IF NOT EXISTS `banking` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8_general_ci */;
USE `banking`;
-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: banking
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `contact` (
  `id` varchar(45) NOT NULL,
  `customerId` varchar(45) NOT NULL,
  `toAccNumber` varchar(45) NOT NULL,
  `toNickName` varchar(45) NOT NULL,
  `createdAt` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT HARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES ('SCQzYOIHR','RS9vvnjvYR','91538945','tôi là rô bót','2019-01-06 14:08');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `history` (
  `id` varchar(45) NOT NULL,
  `payAccId` varchar(45) NOT NULL,
  `fromAccNumber` varchar(45) NOT NULL,
  `toAccNumber` varchar(45) NOT NULL,
  `amount` varchar(45) NOT NULL,
  `feeType` varchar(45) NOT NULL,
  `transactionType` varchar(45) NOT NULL,
  `message` varchar(45) NOT NULL,
  `createdAt` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT HARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES ('SiJmIz8ej','-Qh5Vpqew','85020173','91538945','123431513','1','sent','hello','2019-01-06 12:48');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payacc`
--

DROP TABLE IF EXISTS `payacc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `payacc` (
  `id` varchar(10) NOT NULL,
  `customerId` varchar(45) NOT NULL,
  `clientEmail` varchar(45) NOT NULL,
  `clientName` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `accNumber` varchar(45) NOT NULL,
  `balance` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `createdAt` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT HARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payacc`
--

LOCK TABLES `payacc` WRITE;
/*!40000 ALTER TABLE `payacc` DISABLE KEYS */;
INSERT INTO `payacc` VALUES ('-Qh5Vpqew','RS9vvnjvYR','taulakha1ch@gmail.com','customer3','06983544','85020173','0','OPEN','2018-12-31 09:45'),('-wvMpkUZE','8yZfAOq1pm','songvancam@gmail.com','khach1','06983544','44654942','0','OPEN','2019-01-02 12:38'),('avVPUBuDR','8yZfAOq1pm','songvancam@gmail.com','khach1','06983544','87240963','0','CLOSED','2018-12-30 15:36'),('g-glCUcHA','oOyRmS5bjC','taulakhach@gmail.com','customer2','06983544','98592933','41341','OPEN','2019-01-02 10:14'),('HpkAfQDxN','RS9vvnjvYR','taulakha1ch@gmail.com','customer3','06983544','83383813','41341','OPEN','2018-12-31 01:25'),('I7tJtF8pH','8yZfAOq1pm','songvancam@gmail.com','khach1','06983544','16294995','0','OPEN','2019-01-02 12:36'),('LHeouDxxR','RS9vvnjvYR','taulakha1ch@gmail.com','customer3','06983544','26834461','0','OPEN','2018-12-31 01:24'),('LhSB6X-xW','8yZfAOq1pm','songvancam@gmail.com','khach1','06983544','47046880','0','OPEN','2019-01-02 12:37'),('Sn7zMmVFP','oOyRmS5bjC','taulakhach@gmail.com','customer2','06983544','91538945','123','OPEN','2018-12-31 01:24');
/*!40000 ALTER TABLE `payacc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userreftokenext`
--

DROP TABLE IF EXISTS `userreftokenext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userreftokenext` (
  `f_userId` varchar(10) NOT NULL,
  `f_refToken` varchar(80) NOT NULL,
  `f_rdt` varchar(19) NOT NULL,
  PRIMARY KEY (`f_userId`)
) ENGINE=InnoDB DEFAULT HARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userreftokenext`
--

LOCK TABLES `userreftokenext` WRITE;
/*!40000 ALTER TABLE `userreftokenext` DISABLE KEYS */;
INSERT INTO `userreftokenext` VALUES ('12rnhP7g16','uY02bQgDORpcWqWi9Nbhd183vtZkskNeNyplJgTQ0xpVjwlLkOqZEnlb2fOp2EEqmL9we0YMAlcF2FrO','2018-12-30 08:45:22'),('7kxwDSxCrD','7YhcjW3HB3AqoWjAMW9BoBSsmXzWtHiMvLuwLeX08xx0x1xoZ4I4LMgDF73M0RnAmXmA1V9I74e40QxK','2019-01-02 09:54:12'),('oOyRmS5bjC','iJvUnRSbCzFEfYiHp5dYlWqVIjDvsXg2AxVHCE0pDwdwLcSh1YRWlPpjVA6Tn1whoOAkv2QjK4HQcjdP','2019-01-02 10:17:28'),('RS9vvnjvYR','zwLoAJPSTcus3alVO8o8OJDSflSM1hp3kbRWjIVJIRWa0bRXp8Qt6QmRUsR7L2ocFVVAp64gzVAqbmzM','2019-01-02 07:46:18'),('wdqrEyohs7','e5sLeQ9NFXpkpU5CrLnjgnqkeWuBxYMa2cERPxqAuSX8pE8ZjvMAnZVpLXa4QtGvdQa0hSjttFlRCI3A','2019-01-02 09:30:39');
/*!40000 ALTER TABLE `userreftokenext` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `f_id` varchar(10) NOT NULL,
  `f_username` varchar(45) NOT NULL,
  `f_password` varchar(45) NOT NULL,
  `f_email` varchar(45) NOT NULL,
  `f_name` varchar(45) NOT NULL,
  `f_phone` varchar(45) NOT NULL,
  `f_type` int(1) unsigned NOT NULL,
  `f_createdAt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`f_id`),
  UNIQUE KEY `f_email_UNIQUE` (`f_email`)
) ENGINE=InnoDB DEFAULT HARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('7kxwDSxCrD','staff','202cb962ac59075b964b07152d234b70','taulanhanvienm@gmail.com','nhanvien','06983544',2,'2018-12-30 16:34'),('oOyRmS5bjC','customer2','202cb962ac59075b964b07152d234b70','taulakhach@gmail.com','khachhangquen','06983544',1,'2018-12-30 16:37'),('RS9vvnjvYR','customer3','202cb962ac59075b964b07152d234b70','taulakha1ch@gmail.com','khachhangquen1','06983544',1,'2018-12-30 16:38'),('wdqrEyohs7','client','202cb962ac59075b964b07152d234b70','songvancam@gmail.com','khach','06983544',1,'2018-12-30 16:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'banking'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-06 14:10:23
