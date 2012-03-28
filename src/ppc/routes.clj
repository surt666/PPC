(ns ppc.routes
  (:use compojure.core
        ring.middleware.resource
        ring.middleware.file-info       
        ring.commonrest
        yousee-common.web)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]            
            [clojure.data.json :as json]))

(defroutes handler
  (POST ["/:context/prisplan/:kontrakt/:varenr" , :context #".[^/]*"] req        
        (let [res (parse-body (:body req))]
          (json-response res "application/json"))))
        
(def app
  (-> (handler/site handler)
      (wrap-resource "public")
      (wrap-file-info)))