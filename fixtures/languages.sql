-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.2.13-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table aromati.languages
CREATE TABLE IF NOT EXISTS `languages` (
  `name` varchar(2) NOT NULL,
  `label` text NOT NULL,
  `order` smallint(1) NOT NULL,
  KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table aromati.languages: ~3 rows (approximately)
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT IGNORE INTO `languages` (`name`, `label`, `order`) VALUES
	('en', 'En', 1),
	('ru', 'Ru', 2),
	('lv', 'Lv', 3);
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
