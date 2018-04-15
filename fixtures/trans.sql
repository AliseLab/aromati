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

-- Dumping structure for table aromati.trans
CREATE TABLE IF NOT EXISTS `trans` (
  `id` varchar(64) NOT NULL,
  `language` varchar(2) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`,`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table aromati.trans: ~2 rows (approximately)
/*!40000 ALTER TABLE `trans` DISABLE KEYS */;
INSERT IGNORE INTO `trans` (`id`, `language`, `text`) VALUES
	('settings_email', 'lv', 'lv.email@email.com'),
	('settings_email', 'ru', 'ru.email@email.com');
/*!40000 ALTER TABLE `trans` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
