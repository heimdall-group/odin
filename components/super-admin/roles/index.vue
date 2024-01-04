<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';

  const store = useStore()
  const viewsStore = useViewsStore()
  const user = computed(() => store.getUser)
  const state = computed(() => viewsStore.getState)
  

  const roles = reactive([] as Array<Role>);
  const role = ref({} as Role);
  const permissions_view = ref(false);
  const roles_loading = ref(false);

  const permissions = ref({} as {[key:string]: {read: boolean, write: boolean, name?: string}});

  const new_permission_loading = ref(false);
  const new_permission_name = ref('');
  const new_permission_read = ref(false);
  const new_permission_write = ref(false);

  const remove_permission_loading = ref(true);
  const remove_permission_name = ref('');

  const manage_permissions_loading = ref(false);

  const token = await user.value.getIdToken();
  const { data } = await useAsyncData('roles', () => useInternalFetch(`/api/v1/roles/${token}`, {
    method: 'GET',
  }));

  const insertData = (data: globalThis.Ref<Server_Return>) => {
    if (data.value.success && data.value.data.length > 0) {
      roles.push(...data.value.data);
      for (const key in roles[0].permissions) {
        roles[0].permissions[key].name = key.replace('-', ' ');
      }
      role.value.active = false;
      role.value = roles[0];
      roles[0].active = true;

      const keys = Object.keys(roles[0].permissions)
      const obj: {[key:string]: {read: boolean, write: boolean, name?: string}} = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        obj[key] = {
          read: false,
          write: false,
          name: roles[0].permissions[key].name,
        }
      }
      permissions.value = obj;
    }
  }

  const setActiveItem = (newRole: Role) => {
    for (const key in newRole.permissions) {
      newRole.permissions[key].name = key.replace('-', ' ');
    }
    role.value.active = false;
    role.value = newRole;
    newRole.active = true;
    permissions_view.value = true;
  }

  const savePermissions = async () => {
    roles_loading.value = true;
    const token = await user.value.getIdToken();
    const result = await useInternalFetch(`/api/v1/roles/manage/${token}`, {
      method: 'PUT',
      body: {
        id: role.value.id,
        permissions: role.value.permissions,
      }
    })

    roles_loading.value = false;
  }

  const addPermissions = async () => {
    new_permission_loading.value = true;
    const token = await user.value.getIdToken();
    const result = await useInternalFetch(`/api/v1/roles/permissions/pledge/${token}`, {
      method: 'PUT',
      body: {
        name: new_permission_name.value,
        write: new_permission_write.value,
        read: new_permission_read.value,
      }
    })

    if(result.success) {
      roles.forEach((role) => {
        role.permissions[new_permission_name.value] = {
          write: new_permission_write.value,
          read: new_permission_read.value,
          name: new_permission_name.value.replace('-', ' '),
        }
      })
    }
    
    permissions.value[new_permission_name.value] = {
      write: new_permission_write.value,
      read: new_permission_read.value,
      name: new_permission_name.value.replace('-', ' '),
    }

    new_permission_loading.value = false;
    new_permission_name.value = '';
    new_permission_read.value = false;
    new_permission_write.value = false;
  }

  const managePermissions = async () => {
    manage_permissions_loading.value = true;
    const token = await user.value.getIdToken();
    const result = await useInternalFetch(`/api/v1/roles/permissions/manage/${token}`, {
      method: 'PUT',
      body: {
        permissions: permissions.value,
      }
    })

    if(result.success) {
      roles.forEach((role) => {
        role.permissions = JSON.parse(JSON.stringify(permissions.value))
      })
    }
    manage_permissions_loading.value = false;
  }

  const removePermissionItem = async (permission: {read: boolean, write: boolean, name?: string}) => {
    delete permissions.value[permission.name ? permission.name.replace(' ', '-') : '']
  }

  const removePermission = async () => {
    remove_permission_loading.value = true;
    const token = await user.value.getIdToken();
    const name = remove_permission_name.value.replace(' ', '-');
    const result = await useInternalFetch(`/api/v1/roles/permissions/revoke/${token}`, {
      method: 'PUT',
      body: {
        name: name,
      }
    })

    if(result.success) {
      remove_permission_name.value = '';
      delete permissions.value[name];
      roles.forEach((role) => {
        delete role.permissions[name]
      })
    }
    remove_permission_loading.value = false;
  }

  insertData(data as globalThis.Ref<Server_Return>);
</script>

<template>
  <v-container class="super-admin-roles">
    <v-row class="ma-0">
      <app-templates-section class="manage-roles" cols="12" :card-title="$t('super-admin-rules-manage-roles-title')">
          <v-row class="flex-nowrap" :class="{'permissions-view': permissions_view}">
            <v-col cols="12" class="pt-0 v-col" sm="auto">
              <v-list bg-color="background">
                <v-list-item
                  v-for="(item, index) in roles"
                  :key="`super-admin-roles-manage-role-${index}`"
                >
                  <template #prepend>
                    <font-awesome-icon icon="fa-solid fa-circle" size="2xs" />
                  </template>
                  <v-btn
                    variant="text"
                    :active="item.active"
                    class="cursor-pointer ml-4"
                    rounded="xl"
                    @click="() => {setActiveItem(item)}"
                  >
                    {{item.name}}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col class="pt-0 v-col manage-roles-permissions">
              <v-list bg-color="background">
                <template
                  v-for="(permission, index) in role.permissions"
                  :key="`super-admin-roles-manage-role-permission-${index}`"
                >
                  <v-list-item>
                    <p class="text-capitalize body-1">{{permission.name}}:</p>
                    <v-row class="ma-0 pl-5" align="center" justify="space-between">
                      <v-col cols="9" class="pa-1">
                        {{$t('super-admin-rules-manage-roles-list-item-read',{name: permission.name})}}
                      </v-col>
                      <v-col cols="auto" class="pa-1">
                        <v-checkbox 
                          v-model="permission.read"
                          :ripple="false"
                          hide-details
                          density="comfortable"
                          false-icon="fa-solid fa-square-xmark"
                          true-icon="fa-solid fa-square-check"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="9" class="pa-1">
                        {{$t('super-admin-rules-manage-roles-list-item-write',{name: permission.name})}}
                      </v-col>
                      <v-col cols="auto" class="pa-1">
                        <v-checkbox 
                          v-model="permission.write"
                          :ripple="false"
                          hide-details
                          density="comfortable"
                          false-icon="fa-solid fa-square-xmark"
                          true-icon="fa-solid fa-square-check"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </template>
              </v-list>
              <v-row class="ma-0 pa-2 pt-5" justify="end">
                <v-btn
                  v-if="state === 'xs'"
                  rounded="xl"
                  @click="permissions_view = false"
                  class="mr-2"
                  prepend-icon="fa-solid fa-chevron-left"
                >
                  {{role.name}}
                </v-btn>
                <dialogs-confirm :success-handler="savePermissions">
                  <template #activator="{toggle}">
                    <v-btn
                      :loading="roles_loading"
                      @click="() => {toggle()}"
                      color="primary"
                    >
                      {{$t('button-save')}}
                    </v-btn>
                  </template>
                </dialogs-confirm>
              </v-row>
            </v-col>
          </v-row>
      </app-templates-section>
      
      <v-col cols="12">
        <p class="text-error text-h5">Danger Zone</p>
      </v-col>

      <app-templates-section class="add-permissions" cols="12" :card-title="$t('super-admin-rules-add-permissions-title')" title-color="error">
        <ul class="pl-7">
          <li class="text-error">{{$t('super-admin-rules-add-permissions-subtitle-1')}}</li>
          <li class="text-error">{{$t('super-admin-rules-add-permissions-subtitle-2')}}</li>
        </ul>
        <v-row class="ma-0 mt-2" align="center">
          <v-col cols="12" sm="auto">
            <v-text-field
              v-model="new_permission_name"
              hide-details
              variant="solo"
              :label="$t('super-admin-rules-add-permissions-name')"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="auto" class="d-flex justify-center align-center">
            <v-checkbox 
              v-model="new_permission_read"
              :ripple="false"
              hide-details
              density="comfortable"
              class="mx-1"
              :label="$t('super-admin-rules-add-permissions-read')"
              false-icon="fa-solid fa-square-xmark"
              true-icon="fa-solid fa-square-check"
            ></v-checkbox>
            <v-checkbox 
              v-model="new_permission_write"
              :ripple="false"
              hide-details
              density="comfortable"
              class="mx-1"
              :label="$t('super-admin-rules-add-permissions-write')"
              false-icon="fa-solid fa-square-xmark"
              true-icon="fa-solid fa-square-check"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row class="ma-0" align="center" justify="end">
          <dialogs-confirm :success-handler="addPermissions">
            <template #activator="{toggle}">
              <v-btn
                :loading="new_permission_loading"
                @click="() => {toggle()}"
                class="ma-2 ml-0"
                color="primary"
              >
                {{$t('button-save')}}
              </v-btn>
            </template>
          </dialogs-confirm>
        </v-row>
      </app-templates-section>

      <app-templates-section class="remove-permissions" cols="12" :card-title="$t('super-admin-rules-remove-permissions-title')" title-color="error">
        <ul class="pl-7">
          <li class="text-error">{{$t('super-admin-rules-remove-permissions-subtitle-1')}}</li>
        </ul>
        <v-radio-group class="py-2 pt-4" v-model="remove_permission_name" hide-details>
          <v-radio 
            v-for="(item, index) in permissions"
            :key="`super-admin-remove-permission-radio-${index}`" 
            :label="item.name" 
            :value="item.name"
            :ripple="false"
            false-icon="fa-regular fa-circle"
            true-icon="fa-regular fa-circle-dot"
            class="text-capitalize"
          ></v-radio>
        </v-radio-group>
        <v-row class="ma-0" align="center" justify="end">
          <dialogs-confirm :success-handler="removePermission">
            <template #activator="{toggle}">
              <v-btn
                :loading="new_permission_loading"
                @click="() => {toggle()}"
                class="ma-2 ml-0"
                color="primary"
              >
                {{$t('button-remove')}}
              </v-btn>
            </template>
          </dialogs-confirm>
        </v-row>
      </app-templates-section>

      <app-templates-section class="manage-permissions" cols="12" :card-title="$t('super-admin-rules-manage-permissions-title')" title-color="error">
        <v-label class="px-1 text-wrap text-error">{{$t('super-admin-rules-manage-permissions-subtitle')}}</v-label>
        <v-list bg-color="background" class="pl-0">
          <v-list-item
            v-for="(item, index) in permissions"
            :key="`super-admin-roles-permissions-list-item-${index}`"
            class="d-flex align-center justify-start pl-0"
          >
            <v-row class="ma-0 mt-2" align="center">
              <v-col cols="12" sm="auto">
                <v-text-field
                  v-model="item.name"
                  hide-details
                  variant="solo"
                  :label="$t('super-admin-rules-add-permissions-name')"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="auto" class="d-flex justify-center align-center">
                <v-checkbox 
                  v-model="item.read"
                  :ripple="false"
                  hide-details
                  density="comfortable"
                  class="mx-1"
                  :label="$t('super-admin-rules-add-permissions-read')"
                  false-icon="fa-solid fa-square-xmark"
                  true-icon="fa-solid fa-square-check"
                ></v-checkbox>
                <v-checkbox 
                  v-model="item.write"
                  :ripple="false"
                  hide-details
                  density="comfortable"
                  class="mx-1"
                  :label="$t('super-admin-rules-add-permissions-write')"
                  false-icon="fa-solid fa-square-xmark"
                  true-icon="fa-solid fa-square-check"
                ></v-checkbox>
              </v-col>
            </v-row>
            <template #append>
              <dialogs-confirm :success-handler="() => {removePermissionItem(item)}">
              <template #label>{{$t('super-admin-rules-manage-permissions-remove-label')}}</template>
                <template #activator="{toggle}">
                  <v-btn
                    @click="() => {toggle()}"
                    icon="fa-solid fa-xmark"
                    variant="plain"
                    :ripple="false"
                  >
                  </v-btn>
                </template>
              </dialogs-confirm>
            </template>
          </v-list-item>
        </v-list>
          <v-row class="ma-0 pr-2 pb-2" align="center" justify="end">
            <dialogs-confirm :success-handler="managePermissions">
              <template #label>{{$t('super-admin-rules-manage-permissions-save-label')}}</template>
              <template #activator="{toggle}">
                <v-btn
                  :loading="manage_permissions_loading"
                  @click="() => {toggle()}"
                  color="primary"
                >
                  {{$t('button-save')}}
                </v-btn>
              </template>
            </dialogs-confirm>
          </v-row>
      </app-templates-section>
    </v-row>
  </v-container>
</template>

<style>
  .super-admin-roles > .v-row {
    gap: 16px;
  }

  .super-admin-roles .manage-roles .v-card > .v-row {
    margin: -8px -12px -12px -12px;
  }

  .super-admin-roles .manage-roles .v-row > .v-col {
    overflow: hidden;
  }

  .super-admin-roles .manage-roles .v-row .manage-roles-permissions .v-list {
    max-height: 700px;
    overflow-y: auto;
  }

  .super-admin-roles .manage-permissions .v-list .v-list-item,
  .super-admin-roles .manage-roles .v-list .v-list-item {
    max-width: 700px;
  }

  .super-admin-roles ul {
    list-style-type: style outside;
  }

  .super-admin-roles .v-text-field {
      width: 400px;
    }

  @media screen and (max-width: 600px) {
    .super-admin-roles .manage-roles .v-card > .v-row {
      transform: translateY(0);
      transition-property: transform;
      transition-duration: 200ms;
    }

    .super-admin-roles .v-text-field {
      width: unset;
    }

    .super-admin-roles .manage-roles .v-card > .v-row.permissions-view {
      transform: translateY(-100%);
    }

    .super-admin-roles .manage-roles .v-card > .v-row > .manage-roles-permissions {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .super-admin-roles .manage-roles .v-card > .v-row .manage-roles-permissions .v-list {
      max-height: 550px;
    }
  }
</style>
