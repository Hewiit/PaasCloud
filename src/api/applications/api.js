import request from "@/http/request";
const url = {
  list_pods: "/list_pods",
  list_nodes: "/list_nodes",
  list_deployments: "/list_deployments",
  list_services: "/list_services",
  list_applications: "/list_applications",
  create_deployment: "/create_deployment",
  update_deployment: "/update_deployment",
  delete_deployment: "/delete_deployment",
  create_service: "/create_service",
  update_service: "/update_service",
  delete_service: "/delete_service",
  create_application: "/create_application",
  delete_application: "/delete_application",
};

export const apps = {
  isMockMode: false,
  getPods: function() {
    return request({
      url: url.list_pods,
      method: "get",
    });
  },
  getNodes: function() {
    return request({
      url: url.list_nodes,
      method: "get",
    });
  },
  getDeployments: function() {
    return request({
      url: url.list_deployments,
      method: "get",
    });
  },
  getServices: function() {
    return request({
      url: url.list_services,
      method: "get",
    });
  },
  getApps: function() {
    return request({
      url: url.list_applications,
      method: "get",
    });
  },
  create_deployment: function(namespace, yaml) {
    var params = new FormData();
    params.set("namespace", namespace);
    params.set("config", yaml);
    return request({
      method: "post",
      url: url.create_deployment,
      data: params,
    });
  },
  update_deployment: function(name, namespace, yaml) {
    var params = new FormData();
    params.set("name", name);
    params.set("namespace", namespace);
    params.set("config", yaml);
    return request({
      method: "post",
      url: url.update_deployment,
      data: params,
    });
  },
  delete_deployment: function(name, namespace) {
    var params = new FormData();
    params.set("name", name);
    params.set("namespace", namespace);
    return request({
      method: "post",
      url: url.delete_deployment,
      data: params,
    });
  },
  create_service: function(namespace, yaml) {
    var params = new FormData();
    params.set("namespace", namespace);
    params.set("config", yaml);
    return request({
      method: "post",
      url: url.create_service,
      data: params,
    });
  },
  update_service: function(name, namespace, yaml) {
    var params = new FormData();
    params.set("name", name);
    params.set("namespace", namespace);
    params.set("config", yaml);
    return request({
      method: "post",
      url: url.update_service,
      data: params,
    });
  },
  delete_service: function(name, namespace) {
    var params = new FormData();
    params.set("name", name);
    params.set("namespace", namespace);
    return request({
      method: "post",
      url: url.delete_service,
      data: params,
    });
  },
  create_application: function(namespace, deploy, service) {
    var params = new FormData();
    params.set("namespace", namespace);
    params.set("deployment_config", deploy);
    params.set("service_config", service);
    return request({
      method: "post",
      url: url.create_application,
      data: params,
    });
  },
  delete_application: function(namespace) {
    var params = new FormData();
    params.set("namespace", namespace);
    return request({
      method: "post",
      url: url.delete_application,
      data: params,
    });
  },
  mock: {
    getPods: function() {
      return !apps.isMockMode
        ? apps.getPods()
        : new Promise((resolve) => {
            resolve([
              {
                container_statuses: [
                  {
                    container_id:
                      "docker://721d2246f26979b8f94b3bbb4702be39de902b8ff6d04f70520377ecd969a398",
                    image:
                      "registry.cn-hangzhou.aliyuncs.com/google_containers/coredns/coredns:v1.8.4",
                    image_id:
                      "docker-pullable://registry.cn-hangzhou.aliyuncs.com/google_containers/coredns@sha256:6e5a02c21641597998b4be7cb5eb1e7b02c0d8d23cce4dd09f4682d463798890",
                    name: "coredns",
                    ready: true,
                  },
                ],
                creation_timestamp: "Fri, 22 Oct 2021 16:13:47 GMT",
                name: "coredns-7d89d9b6b8-2c4b9",
                namespace: "kube-system",
                node_name: "minikube",
                pod_ip: "172.17.0.2",
              },
              {
                container_statuses: [
                  {
                    container_id:
                      "docker://565f07addd5527cdfb10d6501a9c7068c7f81173f49597ae5c05601b45b16f62",
                    image:
                      "registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.5.0-0",
                    image_id:
                      "docker://sha256:0048118155842e4c91f0498dd298b8e93dc3aecc7052d9882b76f48e311a76ba",
                    name: "etcd",
                    ready: true,
                  },
                ],
                creation_timestamp: "Fri, 22 Oct 2021 16:13:35 GMT",
                name: "etcd-minikube",
                namespace: "kube-system",
                node_name: "minikube",
                pod_ip: "192.168.49.2",
              },
              {
                container_statuses: [
                  {
                    container_id:
                      "docker://4f1a963f9718da8bb4761f63a7990582a14373fa18c7a3439afb3f211490568d",
                    image:
                      "registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.22.2",
                    image_id:
                      "docker://sha256:e64579b7d8862eff8418d27bf67011e348a5d926fa80494a6475b3dc959777f5",
                    name: "kube-apiserver",
                    ready: true,
                  },
                ],
                creation_timestamp: "Fri, 22 Oct 2021 16:13:35 GMT",
                name: "kube-apiserver-minikube",
                namespace: "kube-system",
                node_name: "minikube",
                pod_ip: "192.168.49.2",
              },
            ]);
          });
    },
    getNodes: function() {
      return !apps.isMockMode
        ? apps.getNodes()
        : new Promise((resolve) => {
            resolve([
              {
                allocatable: {
                  cpu: "4",
                  "ephemeral-storage": "61255492Ki",
                  "hugepages-1Gi": "0",
                  "hugepages-2Mi": "0",
                  memory: "2033396Ki",
                  pods: "110",
                },
                creation_timestamp: "Fri, 22 Oct 2021 16:13:31 GMT",
                kind: null,
                name: "minikube",
                namespace: null,
                phase: null,
              },
            ]);
          });
    },
    getDeployments: function() {
      return !apps.isMockMode
        ? apps.getDeployments()
        : new Promise((resolve) => {
            resolve([
              {
                available_replicas: 2,
                creation_timestamp: "Fri, 22 Oct 2021 16:26:45 GMT",
                name: "nginx-test",
                namespace: "default",
                replicas: 2,
              },
              {
                available_replicas: 1,
                creation_timestamp: "Fri, 22 Oct 2021 16:13:34 GMT",
                name: "coredns",
                namespace: "kube-system",
                replicas: 1,
              },
            ]);
          });
    },
    getServices: function() {
      return !apps.isMockMode
        ? apps.getServices()
        : new Promise((resolve) => {
            resolve([
              {
                cluster_ip: "10.96.0.1",
                creation_timestamp: "Fri, 22 Oct 2021 16:13:32 GMT",
                external_i_ps: null,
                name: "kubernetes",
                namespace: "default",
                ports: [{ node_port: null, port: 443, protocol: "TCP" }],
                type: "ClusterIP",
              },
              {
                cluster_ip: "10.105.133.17",
                creation_timestamp: "Sat, 23 Oct 2021 08:45:35 GMT",
                external_i_ps: null,
                name: "nginx-service",
                namespace: "default",
                ports: [{ node_port: 32180, port: 80, protocol: "TCP" }],
                type: "NodePort",
              },
              {
                cluster_ip: "10.96.0.10",
                creation_timestamp: "Fri, 22 Oct 2021 16:13:34 GMT",
                external_i_ps: null,
                name: "kube-dns",
                namespace: "kube-system",
                ports: [
                  { node_port: null, port: 53, protocol: "UDP" },
                  { node_port: null, port: 53, protocol: "TCP" },
                  { node_port: null, port: 9153, protocol: "TCP" },
                ],
                type: "ClusterIP",
              },
            ]);
          });
    },
    getApps: function() {
      return !apps.isMockMode
        ? apps.getApps()
        : new Promise((resolve) => {
            resolve([
              {
                deployments: [
                  {
                    available_replicas: 3,
                    creation_timestamp: "Mon, 25 Oct 2021 13:37:04 GMT",
                    name: "nginx",
                    namespace: "application-test",
                    replicas: 3,
                  },
                  {
                    available_replicas: 2,
                    creation_timestamp: "Mon, 25 Oct 2021 13:37:04 GMT",
                    name: "nginx-test",
                    namespace: "application-test",
                    replicas: 2,
                  },
                ],
                namespace: "application-test",
                services: [
                  {
                    cluster_ip: "10.103.48.107",
                    creation_timestamp: "Mon, 25 Oct 2021 13:37:05 GMT",
                    external_i_ps: null,
                    name: "nginx-service",
                    namespace: "application-test",
                    ports: [{ node_port: 32180, port: 80, protocol: "TCP" }],
                    type: "NodePort",
                  },
                ],
              },
              {
                deployments: [],
                namespace: "default",
                services: [
                  {
                    cluster_ip: "10.96.0.1",
                    creation_timestamp: "Fri, 22 Oct 2021 16:13:32 GMT",
                    external_i_ps: null,
                    name: "kubernetes",
                    namespace: "default",
                    ports: [{ node_port: null, port: 443, protocol: "TCP" }],
                    type: "ClusterIP",
                  },
                ],
              },
              { deployments: [], namespace: "kube-node-lease", services: [] },
              { deployments: [], namespace: "kube-public", services: [] },
              {
                deployments: [
                  {
                    available_replicas: 1,
                    creation_timestamp: "Fri, 22 Oct 2021 16:13:34 GMT",
                    name: "coredns",
                    namespace: "kube-system",
                    replicas: 1,
                  },
                ],
                namespace: "kube-system",
                services: [
                  {
                    cluster_ip: "10.96.0.10",
                    creation_timestamp: "Fri, 22 Oct 2021 16:13:34 GMT",
                    external_i_ps: null,
                    name: "kube-dns",
                    namespace: "kube-system",
                    ports: [
                      { node_port: null, port: 53, protocol: "UDP" },
                      { node_port: null, port: 53, protocol: "TCP" },
                      { node_port: null, port: 9153, protocol: "TCP" },
                    ],
                    type: "ClusterIP",
                  },
                ],
              },
            ]);
          });
    },
    create_deployment: function(namespace, yaml) {
      return !apps.isMockMode
        ? apps.create_deployment(namespace, yaml)
        : new Promise((resolve) => {
            resolve("create success");
          });
    },
    update_deployment: function(name, namespace, yaml) {
      return !apps.isMockMode
      ? apps.update_deployment(name,namespace, yaml)
      : new Promise((resolve) => {
          resolve("update success");
        });
    },
    delete_deployment: function(name, namespace) {
      return !apps.isMockMode
      ? apps.delete_deployment(name,namespace)
      : new Promise((resolve) => {
          resolve("delete success");
        });
    },
    create_service: function(namespace, yaml) {
      return !apps.isMockMode
      ? apps.create_service(namespace, yaml)
      : new Promise((resolve) => {
          resolve("create success");
        });
    },
    update_service: function(name, namespace, yaml) {
      return !apps.isMockMode
      ? apps.update_service(name,namespace, yaml)
      : new Promise((resolve) => {
          resolve("update success");
        });
    },
    delete_service: function(name, namespace) {
      return !apps.isMockMode
      ? apps.delete_service(name,namespace)
      : new Promise((resolve) => {
          resolve("delete success");
        });
    },
    create_application: function(namespace, deploy, service) {
      return !apps.isMockMode
      ? apps.create_application(namespace, deploy,service)
      : new Promise((resolve) => {
          resolve("create success");
        });
    },
    delete_application: function(namespace) {
      return !apps.isMockMode
      ? apps.delete_application(namespace)
      : new Promise((resolve) => {
          resolve("delete success");
        });
    },
  },
};
