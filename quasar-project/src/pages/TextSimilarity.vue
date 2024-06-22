<template>
  <q-page class="my-page">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">文本相似度计算</div>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="text1" label="输入文本1"></q-input>
        <q-input filled v-model="text2" label="输入文本2"></q-input>
        <q-btn @click="calculateTextSimilarity">计算相似度</q-btn>
      </q-card-section>
      <q-card-section>
        <div v-if="textSimilarityResult !== null">
          <q-linear-progress :value="Number(textSimilarityResult)" color="primary" size="lg"/>
          <div class="text-subtitle2">相似度：{{ (textSimilarityResult * 100).toFixed(2) }}%</div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">文件相似度计算</div>
      </q-card-section>
      <q-card-section>
        <div class="vertical-container">
          <q-btn :color='"primary"' @click="uploadFile1" :disable="file1Uploaded">{{ file1Uploaded ? '文件1已上传' : '上传文件1' }}</q-btn>
          <input type="file" ref="fileInput1" @change="handleFileUpload1" style="display:none"/>
          <q-linear-progress v-if="file1Progress !== null" :value="file1Progress" color="primary" size="lg" />
          <div v-if="file1Uploaded">
            <span>{{ file1.name }}</span>
            <q-btn flat icon="delete" @click="deleteFile1" color="negative" />
          </div>

          <q-btn :color='"primary"' @click="uploadFile2" :disable="file2Uploaded">{{ file2Uploaded ? '文件2已上传' : '上传文件2' }}</q-btn>
          <input type="file" ref="fileInput2" @change="handleFileUpload2" style="display:none"/>
          <q-linear-progress v-if="file2Progress !== null" :value="file2Progress" color="primary" size="lg" />
          <div v-if="file2Uploaded">
            <span>{{ file2.name }}</span>
            <q-btn flat icon="delete" @click="deleteFile2" color="negative" />
          </div>

          <q-btn @click="calculateFileSimilarity">计算文件相似度</q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="fileSimilarityResult !== null">
          <q-linear-progress :value="Number(fileSimilarityResult)" color="primary" size="lg" />
          <div class="text-subtitle2">文件相似度：{{ (fileSimilarityResult * 100).toFixed(2) }}%</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from '../boot/axios' // 导入 api 实例

export default defineComponent({
  name: 'TextSimilarity',
  data () {
    return {
      text1: '',
      text2: '',
      textSimilarityResult: null,
      file1: null,
      file2: null,
      file1Progress: null, // 定义 file1Progress
      file2Progress: null, // 定义 file2Progress
      file1Uploaded: false,
      file2Uploaded: false,
      fileSimilarityResult: null,
      chartOptions: {
        legend: {
          bottom: 10
        },
        tooltip: {},
        dataset: {
          source: [
            ['类型', '相似度'],
            ['文本', 0],
            ['文件', 0]
          ]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          top: '5%',
          containLabel: true
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }]
      }
    }
  },
  methods: {
    async calculateTextSimilarity () {
      console.log('Text 1:', this.text1)
      console.log('Text 2:', this.text2)

      if (!this.text1 || !this.text2) {
        alert('Both text1 and text2 are required.')
        return
      }

      try {
        const response = await api.post('/text_comparison/text/', {
          sentence1: this.text1,
          sentence2: this.text2
        })
        console.log('API response:', response.data)
        this.textSimilarityResult = parseFloat(response.data.result)
        this.chartOptions.dataset.source[1][1] = this.textSimilarityResult * 100
      } catch (error) {
        console.error('Error calculating text similarity:', error)
      }
    },
    uploadFile1 () {
      this.$refs.fileInput1.click()
    },
    uploadFile2 () {
      this.$refs.fileInput2.click()
    },
    handleFileUpload1 (event) {
      console.log('File 1 selected:', event.target.files[0])
      this.file1 = event.target.files[0]
      this.file1Uploaded = true
      this.file1Progress = null
      this.fileSimilarityResult = null // Reset similarity result
      this.chartOptions.dataset.source[2][1] = 0 // Reset chart value
    },
    handleFileUpload2 (event) {
      console.log('File 2 selected:', event.target.files[0])
      this.file2 = event.target.files[0]
      this.file2Uploaded = true
      this.file2Progress = null
      this.fileSimilarityResult = null // Reset similarity result
      this.chartOptions.dataset.source[2][1] = 0 // Reset chart value
    },
    deleteFile1 () {
      console.log('Deleting file 1')
      this.file1 = null
      this.file1Uploaded = false
      this.$refs.fileInput1.value = null // 重置 input 的值
      this.fileSimilarityResult = null // Reset similarity result
      this.chartOptions.dataset.source[2][1] = 0 // Reset chart value
    },
    deleteFile2 () {
      console.log('Deleting file 2')
      this.file2 = null
      this.file2Uploaded = false
      this.$refs.fileInput2.value = null // 重置 input 的值
      this.fileSimilarityResult = null // Reset similarity result
      this.chartOptions.dataset.source[2][1] = 0 // Reset chart value
    },
    async calculateFileSimilarity () {
      console.log('File 1:', this.file1)
      console.log('File 2:', this.file2)

      if (!this.file1 || !this.file2) {
        alert('请上传两个文件')
        return
      }

      const file1Text = await this.readFileContent(this.file1)
      const file2Text = await this.readFileContent(this.file2)

      console.log('File 1 content:', file1Text)
      console.log('File 2 content:', file2Text)

      if (!file1Text || !file2Text) {
        alert('文件内容为空，请上传有效的文件')
        return
      }

      try {
        const response = await api.post('/text_comparison/file/', {
          file1: file1Text,
          file2: file2Text
        })
        console.log('API response:', response.data)
        this.fileSimilarityResult = parseFloat(response.data.result)
        this.chartOptions.dataset.source[2][1] = this.fileSimilarityResult * 100
      } catch (error) {
        console.error('Error calculating file similarity:', error)
      }
    },
    readFileContent (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target.result)
        reader.onerror = (error) => reject(error)
        reader.readAsText(file)
      })
    }
  }
})
</script>

<style>
.my-page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.my-card {
  width: 45%;
  margin: 10px;
}

.vertical-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
