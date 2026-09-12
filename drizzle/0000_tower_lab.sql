CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`participant` text NOT NULL,
	`payload` text NOT NULL,
	`created` text NOT NULL
);

--> statement-breakpoint
CREATE INDEX `attempts_participant` ON `attempts` (`participant`);
--> statement-breakpoint
CREATE TABLE `classes` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`teacher` text NOT NULL,
	`challenge` text NOT NULL,
	`strength` text NOT NULL
);

--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text,
	`token` text NOT NULL,
	`role` text NOT NULL
);

--> statement-breakpoint
CREATE INDEX `participants_token` ON `participants` (`token`);
--> statement-breakpoint
CREATE INDEX `participants_code` ON `participants` (`code`);