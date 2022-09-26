<template>
<li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
    <div class="font-bold">{{comment.userName}}</div>
    <time>{{lapsedTime}} days ago</time>
    </div>

    <p>
    {{comment.content}}
    </p>
</li>
</template>

<script>

export default {
  name: "comment-component",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lapsedTime() {
      const currentTime = new Date();
      const convertedCommentTime = this.comment.datePosted.toDate();
      const timeDiffMill = currentTime - convertedCommentTime;
      const millisInDay = 1000 * 60 * 60 * 24;

      const diff = timeDiffMill / millisInDay;

      return Math.floor(diff);
    },
  },

};
</script>

<style>

</style>
