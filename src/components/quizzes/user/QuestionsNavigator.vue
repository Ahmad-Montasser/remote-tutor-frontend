<template>
  <v-card outlined>
    <v-list-item>
      <v-list-item-content>
        <v-col>
          <p>Questions</p>

          <v-btn-toggle
              v-model="updatedSelection"
              @change="(val) => $emit('update:selectedQuestion', val)"
              tile
              color="deep-purple accent-3"
              group>
            <v-row dense>
              <v-col v-for="(submission, index) in submissions" :key="submission.id" cols="3">
                <v-btn class="rounded-circle"
                       :color="getButtonColor(index)"
                       :value="index"
                       :disabled="updatedSelection === index">
                  {{ index + 1 }}
                </v-btn>
              </v-col>
            </v-row>
          </v-btn-toggle>
          <Timer :end-time="quiz.endTime" :time-up.sync="timeUp"></Timer>
        </v-col>
        <v-dialog v-model="dialog" width="500" :persistent="timeUp">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark v-bind="attrs" v-on="on">Submit</v-btn>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2">
              <div v-if="timeUp">Time's Up</div>
              <div v-else>Confirmation</div>
            </v-card-title>
            <v-card-text>
              <QuizReview :submissions="submissions"></QuizReview>
            </v-card-text>
            <v-card-subtitle v-if="!timeUp">Submit all answers and exit ?</v-card-subtitle>

            <v-divider></v-divider>

            <v-card-actions v-if="timeUp">
              <v-btn text color="secondary" :to="{ name: 'Quizzes' }">OK</v-btn>
            </v-card-actions>
            <v-card-actions v-else>
              <v-btn color="secondary" text @click="hideDialog">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="success" text @click="exit">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item-content>

    </v-list-item>
  </v-card>
</template>

<script>
import api from "@/gateways/api";
import Timer from "@/components/utils/Timer";
import QuizReview from "@/components/quizzes/user/QuizReview";

export default {
  name: "QuestionsNavigator",
  components: {QuizReview, Timer},
  props: ['selectedQuestion', 'submissions'],
  data() {
    return {
      updatedSelection: this.selectedQuestion || 0,
      quiz: {},
      dialog: false,
      timeUp: false,
    }
  },
  methods: {
    getButtonColor(index) {
      if (this.updatedSelection === index)
        return 'primary'
      if (this.submissions[index] === -1)
        return 'secondary'
      return 'success'
    },
    getQuiz() {
      api({
        method: "GET",
        url: "/quizzes/quiz",
        params: {
          id: this.$route.params.quizID,
        }
      }).then(response => {
        this.quiz = response.data.quiz
        // this.quiz.endTime = new Date().getTime() + 10000
      })
    },
    hideDialog() {
      this.dialog = false
    },
    exit() {
      this.hideDialog()
      this.$router.push({ name: 'Quizzes' })
    }
  },
  watch: {
    selectedQuestion(val) {
      this.updatedSelection = val
    },
    timeUp(val) {
      if(val) {
        this.dialog = true
      }
    }
  },
  created() {
    this.getQuiz()
  },
}
</script>

<style scoped>

</style>