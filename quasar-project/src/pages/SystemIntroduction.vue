<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">系统介绍</div>
      </q-card-section>

      <q-card-section>
        <p>
          本系统是一个基于 Django 框架构建的人工智能培训平台，旨在提供高效和用户友好的界面，以快速达到良好的培训效果。系统主要包括以下功能：
        </p>
        <ul>
<!--          <li><strong>系统介绍：</strong>提供系统的基本信息和使用指南。</li>-->
          <li><strong>文本相似度计算：</strong>允许用户输入文本或上传文件，并通过后端计算两个文本的相似度。</li>
          <li><strong>情感分析：</strong>用户可以输入用分号分隔的句子或上传文件，系统将分析文本的情感并生成词云图。</li>
        </ul>
        <p>
          系统的设计考虑了用户体验和性能，确保能够快速响应用户的请求，并提供准确和有用的分析结果。
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'SystemIntroduction'
}
</script>

<style>
.my-card {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
}
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
