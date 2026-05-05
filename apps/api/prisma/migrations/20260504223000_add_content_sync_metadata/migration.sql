CREATE TABLE "content_syncs" (
    "source" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "game_count" INTEGER NOT NULL,
    "theme_count" INTEGER NOT NULL,
    "lesson_count" INTEGER NOT NULL,
    "question_count" INTEGER NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_syncs_pkey" PRIMARY KEY ("source")
);
