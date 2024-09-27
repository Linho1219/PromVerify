<template>
	<i class="icon"><slot></slot></i>
</template>
<style scoped>
@font-face {
  font-family: SegoeIcons;
  src: url("/SegoeIcons.ttf");
}
.icon {
  font-family: SegoeIcons !important;
  font-style: normal !important;
  color: inherit;
}
</style>