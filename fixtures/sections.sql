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

-- Dumping structure for table aromati.sections
CREATE TABLE IF NOT EXISTS `sections` (
  `section` varchar(32) NOT NULL DEFAULT '',
  `enabled` tinyint(1) unsigned DEFAULT NULL,
  `show_in_menu` tinyint(1) unsigned DEFAULT NULL,
  `order` int(4) unsigned DEFAULT NULL,
  `show_in_footer` tinyint(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`section`),
  KEY `order` (`order`),
  KEY `enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table aromati.sections: ~7 rows (approximately)
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT IGNORE INTO `sections` (`section`, `enabled`, `show_in_menu`, `order`, `show_in_footer`) VALUES
	('about', 1, 1, 4, 1),
	('contact', 1, 1, 3, 1),
	('contact2', 1, 0, 9, 0),
	('letsgo', 1, 0, 5, 0),
	('overview', 1, 0, 10, 0),
	('price', 1, 1, 8, 1),
	('project', 1, 0, 6, 0),
	('service', 1, 1, 2, 1),
	('team', 1, 0, 7, 0);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
