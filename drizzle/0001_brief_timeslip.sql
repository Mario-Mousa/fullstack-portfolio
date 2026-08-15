CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderName` varchar(140) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`subject` varchar(220) NOT NULL,
	`body` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(180) NOT NULL,
	`titleAr` varchar(180) NOT NULL,
	`issuer` varchar(180) NOT NULL,
	`issuedAt` varchar(80) NOT NULL,
	`credentialUrl` varchar(500),
	`imageUrl` text,
	`imageKey` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_profiles` (
	`id` int NOT NULL,
	`nameEn` varchar(120) NOT NULL,
	`nameAr` varchar(120) NOT NULL,
	`headlineEn` varchar(220) NOT NULL,
	`headlineAr` varchar(220) NOT NULL,
	`bioEn` text NOT NULL,
	`bioAr` text NOT NULL,
	`locationEn` varchar(120) NOT NULL,
	`locationAr` varchar(120) NOT NULL,
	`avatarUrl` text,
	`avatarKey` text,
	`skillsJson` text NOT NULL,
	`githubUrl` varchar(500),
	`linkedinUrl` varchar(500),
	`email` varchar(320),
	`cvUrl` varchar(500),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(180) NOT NULL,
	`titleAr` varchar(180) NOT NULL,
	`descriptionEn` text NOT NULL,
	`descriptionAr` text NOT NULL,
	`techStackJson` text NOT NULL,
	`imageUrl` text,
	`imageKey` text,
	`githubUrl` varchar(500),
	`liveUrl` varchar(500),
	`featured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_projects_id` PRIMARY KEY(`id`)
);
