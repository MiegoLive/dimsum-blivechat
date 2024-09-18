<template>
  <el-select v-model="model" filterable allow-create default-first-option>
    <el-option-group>
      <el-option v-for="font in LOCAL_FONTS" :key="font" :value="font"></el-option>
    </el-option-group>
    <el-option-group>
      <el-option v-for="font in NETWORK_FONTS" :key="font" :value="font"></el-option>
    </el-option-group>
  </el-select>
</template>

<script setup lang="ts">
import { LOCAL_FONTS, NETWORK_FONTS } from './fonts'

const model = defineModel<string>()
</script>