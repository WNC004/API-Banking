-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2020 at 12:38 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banking`
--

-- --------------------------------------------------------

--
-- Table structure for table `debt`
--

CREATE TABLE `debt` (
  `id` varchar(10) NOT NULL,
  `customer_id` varchar(10) NOT NULL,
  `account` varchar(45) NOT NULL,
  `name_debtors` varchar(255) NOT NULL,
  `amount` varchar(45) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` varchar(2) NOT NULL,
  `reason_deleted` varchar(255) DEFAULT NULL,
  `type` varchar(2) NOT NULL,
  `createdAt` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `debt`
--

INSERT INTO `debt` (`id`, `customer_id`, `account`, `name_debtors`, `amount`, `message`, `status`, `reason_deleted`, `type`, `createdAt`) VALUES
('AMYXhlYxF', 'MSMqOf2Zwz', '97058783', 'Teo', '100', 'toi', '1', '', '1', '2020-06-15 17:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `debt`
--
ALTER TABLE `debt`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- 16/06/2020 tranguyen
ALTER TABLE debt ADD creditor_id VARCHAR(40);
ALTER TABLE debt CHANGE `customer_id` `debtor_id` varchar(40);
ALTER TABLE debt MODIFY type varchar(10);

-- 20/06/2020 tranguyen
ALTER TABLE debt CHANGE `message` `msg` varchar(255);

-- 21/06/2020 tranguyen
ALTER TABLE debt ADD email_debtor VARCHAR(40);
ALTER TABLE debt ADD account_creditor VARCHAR(40);
ALTER TABLE payacc ADD type VARCHAR(2);
ALTER TABLE debt ADD creditor_email VARCHAR(40);

-- 23/06/2020 tranguyen
ALTER TABLE debt ADD creditor_name VARCHAR(40);

-- 26/06/2020 tranguyen
ALTER TABLE history MODIFY createdAt datetime(6);

-- 27/06/2020 tranguyen

CREATE TABLE `banks` (
  `id` varchar(10) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `security_type` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE history ADD bank_id VARCHAR(10);

ALTER TABLE contact ADD bank_id VARCHAR(10);

-- 28/06/2020
INSERT INTO `banks`(`id`, `bank_name`, `security_type`, `status`) VALUES ("ALL", "--ALL--","NONE",1);
    
commit;