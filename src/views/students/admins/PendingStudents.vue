<template>
  <v-app>
    <AnnouncementsAppBar
      :admin="true"
    ></AnnouncementsAppBar>
    <v-main>
        <v-container>
            <StudentsTable :pending="true"></StudentsTable>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AnnouncementsAppBar from "@/components/announcements/shared/AppBar.vue";
import StudentsTable from '@/components/students/admins/StudentsTable.vue'
export default {
    name: "PendingStudents",
    components: {
        AnnouncementsAppBar,
        StudentsTable,
    }
};
</script>