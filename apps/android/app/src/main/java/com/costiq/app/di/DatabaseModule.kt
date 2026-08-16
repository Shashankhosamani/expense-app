package com.costiq.app.di

import android.content.Context
import androidx.room.Room
import com.costiq.app.data.sms.CostiqDatabase
import com.costiq.app.data.sms.PendingSmsDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): CostiqDatabase =
        Room.databaseBuilder(context, CostiqDatabase::class.java, "costiq.db").build()

    @Provides
    fun providePendingSmsDao(database: CostiqDatabase): PendingSmsDao = database.pendingSmsDao()
}
