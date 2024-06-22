<template>
  <q-page class="my-page">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">文字的情感分析</div>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="sentimentInput" label="输入句子"></q-input>
        <q-btn @click="analyzeSentiment" class="q-mt-md">分析情感</q-btn>
      </q-card-section>
      <q-card-section v-if="sentimentResult">
        <div class="text-subtitle2 q-mt-md">情感结果：{{ sentimentResult }}</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card q-mt-lg">
      <q-card-section>
        <div class="text-h6">上传文件分析词云</div>
      </q-card-section>
      <q-card-section>
        <div class="vertical-container">
          <q-btn color="primary" @click="uploadFile" :disable="fileUploaded">{{ fileUploaded ? '文件已上传' : '上传文件' }}</q-btn>
          <input type="file" ref="fileInput" accept=".txt" @change="handleFileUpload" style="display:none" />
          <q-linear-progress v-if="fileProgress !== null" :value="fileProgress" color="primary" size="lg" class="q-mt-md" />
          <div v-if="fileUploaded" class="q-mt-md">
            <span>{{ file.name }}</span>
            <q-btn flat icon="delete" @click="deleteFile" color="negative" />
          </div>
          <q-btn color="primary" @click="generateWordCloud" :disable="!fileUploaded" class="q-mt-md">生成词云图</q-btn>
          <q-spinner v-if="loading" color="primary" size="30px" class="q-mt-md" />
        </div>
      </q-card-section>
      <q-card-section v-if="wordCloudUrls.length" class="q-gutter-md">
        <div v-for="(url, index) in wordCloudUrls" :key="index" class="word-cloud-container">
          <img :src="url" alt="词云图" class="word-cloud-image" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { api } from '../boot/axios' // 导入 axios 实例

export default {
  name: 'TextSentiment',
  data () {
    return {
      sentimentInput: '',
      sentimentResult: null,
      file: null,
      fileProgress: null,
      fileUploaded: false,
      wordCloudUrls: [],
      loading: false // 添加加载状态
    }
  },
  methods: {
    analyzeSentiment () {
      const sentences = this.sentimentInput.split(';')
      if (sentences.length === 1) {
        // 单一语句情感分析
        api.post('/text_classification/single_comment/', {
          text: this.sentimentInput
        })
          .then((response) => {
            console.log('API response:', response.data)
            this.sentimentResult = response.data.result
          })
          .catch((error) => {
            console.error('Error analyzing sentiment:', error)
          })
      } else {
        // 多句情感分析
        api.post('/text_classification/multiple_comments/', {
          text_list: sentences
        })
          .then((response) => {
            console.log('API response:', response.data)
            this.sentimentResult = '生成词云图'
            this.wordCloudUrls = [
              response.data.positive_comments_wordcloud_url,
              response.data.negative_comments_wordcloud_url
            ].filter((url) => url !== null)
          })
          .catch((error) => {
            console.error('Error analyzing sentiment:', error)
          })
      }
    },
    uploadFile () {
      this.$refs.fileInput.click()
    },
    handleFileUpload (event) {
      this.file = event.target.files[0]
      if (this.file && this.file.type === 'text/plain') {
        console.log('File selected:', this.file)
        this.fileUploaded = true
      } else {
        alert('只能上传txt格式的文件')
        this.file = null
      }
    },
    generateWordCloud () {
      if (!this.file) {
        alert('请先上传一个文件')
        return
      }

      this.loading = true // 开始加载
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const sentences = content.split('\n').filter((line) => line.trim())

        api.post('/text_classification/multiple_comments/', {
          text_list: sentences
        })
          .then((response) => {
            console.log('API response:', response.data)
            this.wordCloudUrls = [
              response.data.positive_comments_wordcloud_url,
              response.data.negative_comments_wordcloud_url
            ].filter((url) => url !== null)
          })
          .catch((error) => {
            console.error('Error generating word cloud:', error)
          })
          .finally(() => {
            this.loading = false // 结束加载
          })
      }
      reader.readAsText(this.file)
    },
    deleteFile () {
      this.file = null
      this.fileProgress = null
      this.fileUploaded = false
      this.wordCloudUrls = []
      this.$refs.fileInput.value = ''
      console.log('File deleted')
    }
  }
}
</script>

<style>
.my-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.my-card {
  width: 100%;
  max-width: 600px;
}

.vertical-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.word-cloud-container {
  display: flex;
  justify-content: center;
}

.word-cloud-image {
  max-width: 100%;
  height: auto;
}
</style>
