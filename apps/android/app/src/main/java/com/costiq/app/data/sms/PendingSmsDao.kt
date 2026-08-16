package com.costiq.app.data.sms

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface PendingSmsDao {

    @Insert
    suspend fun insert(entity: PendingSmsEntity): Long

    @Query("SELECT * FROM pending_sms WHERE id = :id")
    suspend fun getById(id: String): PendingSmsEntity?

    @Query("SELECT * FROM pending_sms WHERE status = :status ORDER BY createdAt ASC LIMIT :limit")
    suspend fun getByStatus(status: String = PendingSmsStatus.PENDING, limit: Int = 20): List<PendingSmsEntity>

    @Query("UPDATE pending_sms SET status = :status, lastError = :error, attemptCount = attemptCount + 1 WHERE id = :id")
    suspend fun updateStatus(id: String, status: String, error: String? = null)

    @Query("DELETE FROM pending_sms WHERE status = :status")
    suspend fun deleteByStatus(status: String = PendingSmsStatus.UPLOADED)
}
