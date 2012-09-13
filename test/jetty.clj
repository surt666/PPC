(ns jetty
  (:use ppc.routes
	ring.adapter.jetty)
  (:require [clojure.tools.logging :as logging]
            [clojure.tools.logging.impl :as impl])
  (:import (org.eclipse.jetty.xml XmlConfiguration)
           (org.eclipse.jetty.webapp WebAppContext)))

(defn init-server [server]
  (try
    (alter-var-root (var logging/*logger-factory*) (constantly (impl/log4j-factory)))
    (let [config (XmlConfiguration. (slurp "test/jetty.xml"))]    
      (. config configure server))
    (catch Exception e
      (prn "Unable to load jetty configuration")
      (. e printStackTrace))))

(defonce server
  (run-jetty #'app {:port 8080 :configurator init-server :join? false :context "/ppc"}))  

