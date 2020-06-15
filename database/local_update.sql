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
