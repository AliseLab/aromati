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

-- Dumping structure for table landing.settings
CREATE TABLE IF NOT EXISTS `settings` (
  `key` varchar(64) NOT NULL DEFAULT '',
  `value_text` text DEFAULT NULL,
  `value_trans` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table landing.settings: ~10 rows (approximately)
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT IGNORE INTO `settings` (`key`, `value_text`, `value_trans`) VALUES
	('default_language', 'ru', NULL),
	('email', 'email@email.com', 'settings_email'),
	('facebook', '', NULL),
	('ga_id', '', NULL),
	('jivosite_id', '', NULL),
	('mail_settings', '{"service":"gmail","auth":{"user":"youremail@gmail.com","pass":"yourpassword"},"tls":{"rejectUnauthorized":false}}', NULL),
	('metrika_id', '', NULL),
	('phone', '', NULL),
	('site_title', 'Landing', NULL),
	('vkontakte', '', NULL);
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
