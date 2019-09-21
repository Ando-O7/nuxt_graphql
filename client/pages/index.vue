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
  </div>
</template>

<script>
  import getUsersGql from '~/apollo/queries/getUsers.gql'

  export default {
    date() {
      return {
        users: []
      }
    },
    apollo: {
      users: {
        query: getUsersGql
      }
    }
  }
</script>
