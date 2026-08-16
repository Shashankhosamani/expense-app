package com.costiq.app.data.sms

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [PendingSmsEntity::class], version = 1, exportSchema = true)
abstract class CostiqDatabase : RoomDatabase() {
    abstract fun pendingSmsDao(): PendingSmsDao
}
