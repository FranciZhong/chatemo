/*
  Warnings:

  - You are about to drop the column `status` on the `Friendship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConversationPartipant" ADD COLUMN     "valid" "ValidStatus" NOT NULL DEFAULT 'VALID';

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "status",
ADD COLUMN     "valid" "ValidStatus" NOT NULL DEFAULT 'VALID';
