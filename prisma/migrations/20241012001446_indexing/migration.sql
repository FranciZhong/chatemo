/*
  Warnings:

  - A unique constraint covering the columns `[receiverId,senderId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FriendRequest_senderId_receiverId_key";

-- CreateIndex
CREATE INDEX "Agent_userId_idx" ON "Agent"("userId");

-- CreateIndex
CREATE INDEX "AgentPrompt_agentId_idx" ON "AgentPrompt"("agentId");

-- CreateIndex
CREATE INDEX "ChannelMembership_userId_idx" ON "ChannelMembership"("userId");

-- CreateIndex
CREATE INDEX "ChannelMessage_channelId_valid_createdAt_idx" ON "ChannelMessage"("channelId", "valid", "createdAt");

-- CreateIndex
CREATE INDEX "ChannelRequest_receiverId_idx" ON "ChannelRequest"("receiverId");

-- CreateIndex
CREATE INDEX "ChannelRequest_channelId_idx" ON "ChannelRequest"("channelId");

-- CreateIndex
CREATE INDEX "ConversationMessage_conversationId_idx" ON "ConversationMessage"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationPartipant_userId_idx" ON "ConversationPartipant"("userId");

-- CreateIndex
CREATE INDEX "ConversationPartipant_conversationId_idx" ON "ConversationPartipant"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_receiverId_senderId_key" ON "FriendRequest"("receiverId", "senderId");

-- CreateIndex
CREATE INDEX "Friendship_conversationId_idx" ON "Friendship"("conversationId");
