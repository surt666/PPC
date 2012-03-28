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
  (GET ["/:context/prisplan/:kontrakt" , :context #".[^/]*"] [kontrakt]       
       (json-response (find-pris kontrakt) "application/json"))
  
  (GET ["/:context/prisplan/:kontrakt/:varenr" , :context #".[^/]*"] [kontrakt varenr]
       (json-response (find-pris kontrakt (Integer/parseInt varenr)) "application/json"))
  
  (POST ["/:context/prisplan" , :context #".[^/]*"] req        
        (let [res (parse-body (:body req))]
          (json-response res "application/json"))))
        
(def app
  (-> (handler/site handler)
      (wrap-resource "public")
      (wrap-file-info)
      (wrap-request-log-and-error-handling :body-str :body :status :server-port :query-string :server-name :uri :request-method :content-type :headers :json-params :params)))