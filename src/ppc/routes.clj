(ns ppc.routes
  (:use compojure.core
        ppc.core
        ring.middleware.resource
        ring.middleware.file-info       
        ring.commonrest
        yousee-common.web)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]            
            [clojure.data.json :as json]))

(defroutes handler
  (GET ["/:context/produkter" , :context #".[^/]*"] []       
       (json-response (find-alle-produkter) "application/json"))

  (GET ["/:context/produkter/:varenr" , :context #".[^/]*"] [varenr]       
       (json-response (find-produkt (Integer/parseInt varenr)) "application/json"))

  (GET ["/:context/prisplan/alle" , :context #".[^/]*"] []       
       (json-response (find-alle-planer) "application/json"))
  
  (GET ["/:context/prisplan/:kontrakt" , :context #".[^/]*"] [kontrakt]       
       (json-response (find-pris kontrakt) "application/json"))
  
  (GET ["/:context/prisplan/:kontrakt/:varenr" , :context #".[^/]*"] [kontrakt varenr]
       (json-response (find-pris kontrakt (Integer/parseInt varenr)) "application/json"))

  (GET ["/:context/services/:type" , :context #".[^/]*"] [type]       
       (json-response (find-service type) "application/json"))
  
  (GET ["/:context/services/:type/:id" , :context #".[^/]*"] [type id]
       (json-response (find-service type id) "application/json"))

  (POST ["/:context/services" , :context #".[^/]*"] req        
        (let [res (gem-service (parse-body (:body req)))]
          (if (nil? res)
            (json-response nil "application/json" :status 400)
            (json-response res "application/json"))))

  (PUT ["/:context/sync/:varenr" , :context #".[^/]*"] [varenr]      
        (create-plan varenr))

  (POST ["/:context/produkter" , :context #".[^/]*"] req        
        (let [body (parse-body (:body req))
              res (gem-produkt (assoc body :varenr (Integer/parseInt (:varenr body))))]
          (if (nil? res)
            (json-response nil "application/json" :status 400)
            (json-response res "application/json"))))
  
  (POST ["/:context/prisplan" , :context #".[^/]*"] req        
        (let [body (parse-body (:body req))             
              res (gem-pris (assoc body :varenr (Integer/parseInt (:varenr body))))]
          (if (nil? res)
            (json-response nil "application/json" :status 400)
            (json-response res "application/json")))))
        
(def app
  (-> (handler/site handler)
      (wrap-resource "public")
      (wrap-file-info)
      (wrap-request-log-and-error-handling :body-str :body :status :server-port :query-string :server-name :uri :request-method :content-type :headers :json-params :params)))