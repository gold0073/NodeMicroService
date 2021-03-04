/* "Unnamed" 세션 시작 */
create database monolithic;
CREATE TABLE IF NOT EXISTS `goods` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(128) NOT NULL,
	`category` varchar(128) NOT NULL,
	`price` int NOT NULL,
	`description` text NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `members` (
	`id` int NOT NULL AUTO_INCREMENT,
	`username` varchar(128) NOT NULL,
	`password` varchar(256) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `purchases` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`userid` int NOT NULL,
	`goodsid` int NOT NULL,
	`date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE `USER` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`user_name` VARCHAR(32) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`update_at` DATETIME NULL,
	PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
/* SQL 오류 (1067): Invalid default value for 'created_at' */
CREATE TABLE `CONTENT` (
	`content_id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`title` VARCHAR(32) NOT NULL,
	`context` TEXT NOT NULL,
	`created_at` DATETIME NOT NULL,
	`update_at` DATETIME NULL,
	PRIMARY KEY (`content_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
/* "Unnamed" 세션 시작 */
CREATE TABLE `COMMENT` (
	`comment_id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`content_id` INT NOT NULL,
	`context` VARCHAR(32) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NULL,
	PRIMARY KEY (`comment_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
/* "Unnamed" 세션 시작 */
CREATE TABLE `SUB_COMMENT` (
	`sub_comment_id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`comment_id` INT NOT NULL,
	`context` VARCHAR(32) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`sub_comment_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
/* "Unnamed" 세션 시작 */