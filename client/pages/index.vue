<template>
  <div>
    <button @click="isShowEditArea = true">
      新規登録
    </button>
    
    <table>
        <tr>
          <th>ID</th>
          <th>名前</th>
          <th>メール</th>
          <th>年齢</th>
        </tr>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.age }}</td>
          <td>
            <button @click="editItem(item)">
              編集
            </button>
            <button @click="deleteItem(item)">
              削除
            </button>
          </td>
        </tr>
      </table>

      <div v-if="isShowEditArea">
        <h2>{{ fromTitle }}</h2>
        <div>
          <input v-model="editedItem.name" type="text" placeholder="名前">
        </div>
        <div>
          <input v-model="editedItemd.email" type="text" placeholder="メール">
        </div>
        <div>
          <input v-model="editedItem.age" type="number" placeholder="年齢">
        </div>
        <div>
          <button @click="close">
            キャンセル
          </button>
          <button @click="save">
            保存
          </button>
        </div>
      </div>
  </div>
</template>

<script>
  import getUsersGql from '~/apollo/queries/getUsers.gql'

  export default {
    date() {
      return {
        users: [],
        // flag of insert or update editarea show
        isShowEditArea: false,

        // argment of insert and update flag 
        // case -1 insert, case other update
        editedIndex: -1,

        // model for edit area
        editedItem: {
          id: null,
          name: null,
          email: null,
          age: null
        },

        // init model for edit area
        // at initialization used like "this.editedItem = Object.asigne({}, this.defaultEditedItem)"
        defaultEditedItem: {
          id: null,
          name: null,
          email: null,
          age: null
        }
      }
    },
    apollo: {
      users: {
        query: getUsersGql
      }
    }
  }
</script>
