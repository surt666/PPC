(ns ppc.routes
  (:require [yousee-common.alive.alive :as alive]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [yousee-common.base-url :as bu :only (wrap-create-base-url)]
            [yousee-common.common :as common]
            [yousee-common.web :as web :only (parse-body wrap-guard-rail json-response)]
            [ring.util.response :as resp]
            [clojure.tools.logging :as logging]
            [clojure.tools.logging.impl :as logging-impl])
  (:use compojure.core
        yousee-common.wrappers
        yousee-common.traverse
        ring.middleware.resource
        ring.middleware.file-info
        ppc.core))

(defroutes handler
  (GET ["/:context/produkter" , :context #".[^/]*"] []       
       (web/json-response (find-alle-produkter) "application/json"))

  (GET ["/:context/produkter/:varenr" , :context #".[^/]*"] [varenr]       
       (web/json-response (find-produkt varenr) "application/json"))

  (GET ["/:context/prisplan/alle" , :context #".[^/]*"] []       
       (web/json-response (find-alle-planer) "application/json"))
  
  (GET ["/:context/prisplan/:kontrakt" , :context #".[^/]*"] [kontrakt]       
       (web/json-response (find-pris kontrakt) "application/json"))
  
  (GET ["/:context/prisplan/:kontrakt/:varenr" , :context #".[^/]*"] [kontrakt varenr]
       (web/json-response (find-pris kontrakt varenr) "application/json"))

  (GET ["/:context/services/:type" , :context #".[^/]*"] [type]       
       (web/json-response (find-service type) "application/json"))
  
  (GET ["/:context/services/:type/:id" , :context #".[^/]*"] [type id]
       (web/json-response (find-service type id) "application/json"))

  (POST ["/:context/services" , :context #".[^/]*"] req        
        (let [res (gem-service (web/parse-body (:body req)))]
          (if (nil? res)
            (web/json-response nil "application/json" :status 400)
            (web/json-response res "application/json"))))

  (PUT ["/:context/sync/:varenr" , :context #".[^/]*"] [varenr]      
        (create-plan varenr))

  (POST ["/:context/produkter" , :context #".[^/]*"] req        
        (let [body (web/parse-body (:body req))
              res (gem-produkt (assoc body :varenr (:varenr body)))]
          (if (nil? res)
            (web/json-response nil "application/json" :status 400)
            (web/json-response res "application/json"))))
  
  (POST ["/:context/prisplan" , :context #".[^/]*"] req        
        (let [body (web/parse-body (:body req))             
              res (gem-pris (assoc body :varenr (:varenr body)))]
          (if (nil? res)
            (web/json-response nil "application/json" :status 400)
            (web/json-response res "application/json")))))
        
(def app
  (-> (handler/site handler)
      (wrap-resource "public")
      (wrap-file-info)
      ;(wrap-traverse-links config/mediatype)
      (bu/wrap-create-base-url)
      (web/wrap-guard-rail :debug [:body-str :body :status :server-port :query-string :server-name :uri :request-method :content-type :headers :json-params :params])
      (wrap-body-to-str)))