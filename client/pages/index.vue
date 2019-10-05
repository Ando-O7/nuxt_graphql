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
        <h2>{{ formTitle }}</h2>
        <div>
          <input v-model="editedItem.name" type="text" placeholder="名前">
        </div>
        <div>
          <input v-model="editedItem.email" type="text" placeholder="メール">
        </div>
        <div>
          <input v-model="editedItem.age" type="text" placeholder="年齢">
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
  import createUserGql from '~/apollo/mutations/createUser.gql'
  import updateUserGql from '~/apollo/mutations/updateUser.gql'
  import deleteUserGql from '~/apollo/mutations/deleteUser.gql'
  import userCreatedGql from '~/apollo/subscriptions/userCreated.gql'
  import userUpdatedGql from '~/apollo/subscriptions/userUpdated.gql'
  import userDeletedGql from '~/apollo/subscriptions/userDeleted.gql'

  export default {
    data() {
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

    // case of update, set target nubmer to editedIndex
    // depending on the value of EditorialIndex, it is judged whether it is updated or registered
    computed: {
      formTitle() {
        return this.editedIndex === -1
          ? 'ユーザー新規登録'
          : 'ユーザー更新';
      }
    },

    apollo: {
      users: {
        query: getUsersGql,

        // Subscription is specified in SubscribeToMore of Smart Query
        subscribeToMore: [
          // insert process
          {
            document: userCreatedGql,
            // Define the updateQuery process when Subscription occurs.
            // The first argument is the previous users
            // The second argument is the response information from the server.
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev
              }

              const newUser = subscriptionData.data.userCreated
              // this return value into users
              return prev.users.push(newUser)
            }
          },

          // update process
          {
            document: userUpdatedGql,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev
              }

              const updatedUser = subscriptionData.data.userUpdatedGql
              const targetUser = prev.users.find(user => user.id + '' === updatedUser.id + '')
              targetUser.name = updatedUser.name
              targetUser.email = updatedUser.email
              targetUser.age = updatedUser.age
              return prev.users
            }
          },

          // delete process
          {
            document: userDeletedGql,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev
              }

              const deletedUser = subscriptionData.data.userDeletedGql
              const userIndex = prev.users.findIndex(user => user.id + '' === deletedUser.id + '')

              if (userIndex === -1) throw new Error('User not found')
              
              prev.users.splice(userIndex, 1)
              return prev.users
            }
          }
        ]
      }
    },

    methods: {
      // insert process
      async createItem({
        name,
        email,
        age
      }) {
        // when issuing a mutation, not Smart Query. use $apollo.
        const { error } = await this.$apollo.mutate({
          mutation: createUserGql,
          variables: {
            name,
            email,
            age
          }
        })

        if (error) {
          // error process
        }

        // no show edit area
        this.close();
      },

      // update process
      async updateItem({
        id,
        name,
        email,
        age
      }) {
        const { error } = await this.$apollo.mutate({
          mutation: updateUsrGql,
          variables: {
            id,
            name,
            email,
            age
          }
        })

        if (error) {
          // error process
        }

        this.close();
      },

      // delete process
      async deleteItem(item) {
        if (!confirm(`ユーザー(${item.name})を削除しますか？`)) {
          return
        }
        
        const { error } = await this.$apollo.mutate({
          mutation: deleteUserGql,
          variables: {
            id: item.id
          }
        })

        if (error) {
          // error process
        }
      },

      // edit button push process
      editItem(item) {
        this.editedIndex = this.users.indexOf(item);
        this.editItem = Object.assign({}, item);
        this.isShowEditArea = true;
      },

      // edit area no show process
      close() {
        this.isShowEditArea = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultEditedItem);
          this.editedIndex = -1;
        }, 300)
      },

      // save button push process
      save() {
        if (this.editedIndex > -1) {
          this.updateItem(this.editedItem);
        } else {
          this.createItem(this.editedItem);
        }
      }

    }
  }
</script>
