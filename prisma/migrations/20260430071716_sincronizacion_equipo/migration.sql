-- CreateTable
CREATE TABLE `payment_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` VARCHAR(191) NOT NULL,
    `card_name` VARCHAR(191) NOT NULL,
    `card_number` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payment_cards_payment_id_key`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_cards` ADD CONSTRAINT `payment_cards_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
