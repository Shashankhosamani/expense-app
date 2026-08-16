# Add project specific ProGuard rules here.
# Release build has minification disabled (see app/build.gradle.kts) until
# the app is further along — kept minimal on purpose.

-keepattributes *Annotation*
-keepattributes Signature
-keep class com.costiq.app.data.api.dto.** { *; }
