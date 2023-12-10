<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getInformationLimit,
  getInformationById,
  postUpdateInformationById,
  postNewInfo,
  deleteInfoById,
} from "@/api";
import type { Information } from "@/utils/typeInterface";

const columns = ref([
  { prop: "id", label: "id", width: 50 },
  { prop: "title", label: "题目", width: 150 },
  { prop: "description", label: "简介", width: 200 },
  { prop: "code", label: "源码", width: 300 },
  { prop: "result", label: "结果", width: 150 },
  { prop: "button", label: "操作", width: 200 },
]);

const data = ref<Information>();

async function getData() {
  await getInformationLimit().then((res) => {
    if (res.code == 200) {
      data.value = res.data;
    }
  });
}
const status = ref(false);
const detailInfo = ref<Information>({
  id: 0,
  title: "null",
  description: "null",
  code: "null",
  result: "null",
});
const activeName = ref(["1", "2", "3", "4", "5"]);
async function getContentInformation(id: Number) {
  status.value = true;
  await getInformationById(id).then((res) => {
    if (res.code == 200) {
      console.log(res.data);
      detailInfo.value = res.data;
    }
  });
}

const editor = ref(false);
const formInfo = ref<Information>({
  id: 0,
  title: "null",
  description: "null",
  code: "null",
  result: "null",
});

async function getEditorInformation(id: Number) {
  editor.value = true;
  await getInformationById(id).then((res) => {
    if (res.code == 200) {
      console.log(res.data);
      formInfo.value = res.data;
    }
  });
}
onMounted(async () => {
  getData();
});

async function onSubmitUpdate(data: Information) {
  await postUpdateInformationById(data).then((res) => {
    if (res.code == 200) {
      console.log("update successfully");
      editor.value = false;
      getData();
    }
  });
}

function cancelEditor() {
  editor.value = false;
}

const dialogStatus = ref(false);
const blankForm = ref<Information>({
  id: 0,
  title: "",
  description: "",
  code: "",
  result: "",
});
function showDialog() {
  dialogStatus.value = true;
}
function hideDialog() {
  dialogStatus.value = false;
}
async function onSubmitNew(data: Information) {
  await postNewInfo(data).then((res) => {
    if (res.code == 200) {
      console.log("save successfully");
      hideDialog();
      getData();
    }
  });
}

const deleteStatus = ref(false);
const deleteId = ref<Number | null>(null);

function showDeleteDialog(id: Number) {
  deleteId.value = id;
  deleteStatus.value = true;
}
function hideDeleteDialog() {
  deleteStatus.value = false;
}

async function deleteInfo(id: Number | null) {
  if (id == null) {
    return console.error();
  }
  await deleteInfoById(id).then((res) => {
    if (res.code == 200) {
      console.log("delete successfully");
      hideDeleteDialog();
      getData();
    }
  });
}
</script>
<template>
  <div class="w-full grid justify-center items-center">
    <div class="flex mt-12 justify-center items-center relative h-16">
      <h1>Java实验展示系统</h1>
      <div class="absolute right-0">
        <el-button type="primary" plain @click="showDialog()"
          >增加题目</el-button
        >
      </div>
    </div>
    <el-table :data="data" stripe style="width: 100%" height="500">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template v-if="item.prop == 'button'" #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="getContentInformation(scope.row.id)"
            >Detail</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="getEditorInformation(scope.row.id)"
            >Edit</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="showDeleteDialog(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      v-model="status"
      title="Java实验展示系统-内容"
      direction="ltr"
      size="50%"
    >
      <div>
        <el-collapse v-model="activeName">
          <el-collapse-item title="id" name="1">
            <pre>{{ detailInfo.id }}</pre>
          </el-collapse-item>
          <el-collapse-item title="题目" name="2">
            <pre>{{ detailInfo.title }}</pre>
          </el-collapse-item>
          <el-collapse-item title="简介" name="3">
            <pre>{{ detailInfo.description }}</pre>
          </el-collapse-item>
          <el-collapse-item title="源码" name="4">
            <pre>{{ detailInfo.code }}</pre>
          </el-collapse-item>
          <el-collapse-item title="结果" name="5">
            <pre>{{ detailInfo.result }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>
    <el-drawer
      v-model="editor"
      title="Java实验展示系统-编辑"
      direction="rtl"
      size="50%"
    >
      <div>
        <el-form
          label-position="left"
          label-width="100px"
          :model="formInfo"
          style="max-width: 700px"
        >
          <el-form-item label="id">
            <el-input disabled v-model="formInfo.id" />
          </el-form-item>
          <el-form-item label="题目">
            <el-input
              clearable
              placeholder="请输入题目"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              v-model="formInfo.title"
            />
          </el-form-item>
          <el-form-item label="简介">
            <el-input
              clearable
              placeholder="请输入简介"
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
              v-model="formInfo.description"
            />
          </el-form-item>
          <el-form-item label="源码">
            <el-input
              clearable
              placeholder="请输入源码"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              v-model="formInfo.code"
            />
          </el-form-item>
          <el-form-item label="结果">
            <el-input
              clearable
              placeholder="请输入结果"
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
              v-model="formInfo.result"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitUpdate(formInfo)"
              >Submit</el-button
            >
            <el-button type="primary" @click="cancelEditor">Cancel</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog v-model="dialogStatus" title="新增题目">
      <el-form
        label-position="left"
        label-width="100px"
        :model="blankForm"
        style="max-width: 700px"
      >
        <el-form-item label="题目">
          <el-input
            clearable
            placeholder="请输入题目"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            v-model="blankForm.title"
          />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            clearable
            placeholder="请输入简介"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            v-model="blankForm.description"
          />
        </el-form-item>
        <el-form-item label="源码">
          <el-input
            clearable
            placeholder="请输入源码"
            :autosize="{ minRows: 6, maxRows: 10 }"
            type="textarea"
            v-model="blankForm.code"
          />
        </el-form-item>
        <el-form-item label="结果">
          <el-input
            clearable
            placeholder="请输入结果"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            v-model="blankForm.result"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitNew(blankForm)"
            >Submit</el-button
          >
          <el-button type="primary" @click="hideDialog">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="deleteStatus" title="警告" width="30%" align-center>
      <span>是否确认删除该行数据</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hideDeleteDialog()">Cancel</el-button>
          <el-button type="danger" @click="deleteInfo(deleteId)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss"></style>
