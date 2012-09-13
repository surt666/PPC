(defproject ppc "1.0.0"
  :description "Produkt og Pris katalog"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/data.json "0.1.1"]   
                 [compojure "1.1.3"]
                 [ring/ring-core "1.1.5"]
                 [ring/ring-servlet "1.1.5"]                
                 [org.slf4j/slf4j-simple "1.6.1"]
                 [org.clojure/tools.logging "0.2.3"]
                 [yousee-common "1.0.63"]
                 [dynamo4clj "1.0.9"]
                 [org.clojars.adamwynne/http.async.client "0.4.1"]
                 [com.datomic/datomic-pro "0.8.3488" :exclusions [org.slf4j/slf4j-nop org.slf4j/slf4j-log4j12]]
                 [ring-common "1.1.15"]
                 [log4j "1.2.17" :exclusions [javax.mail/mail
                                              javax.jms/jms
                                              com.sun.jdmk/jmxtools
                                              com.sun.jmx/jmxri]]]

  :exclusions [javax.servlet/servlet-api]

  :plugins [[lein-ring "0.7.5"]
            [yij/lein-plugins "1.0.12"]]

  :repositories {"yousee-releases" {:url "http://yousee.artifactoryonline.com/yousee/libs-releases"
                                    :username "deployer"
                                    :password :env}}

  :profiles {:dev {:dependencies [[clj-stacktrace "0.2.4"]                                  
                                  [ring/ring-jetty-adapter "1.1.5"]
                                  [org.eclipse.jetty/jetty-xml "7.6.1.v20120215"]
                                  [org.eclipse.jetty/jetty-webapp "7.6.1.v20120215"]
                                  [org.eclipse.jetty/jetty-plus "7.6.1.v20120215"]
                                  [javax.servlet/servlet-api "2.5"]]}}
             
  :jvm-opts ["-Dfile.encoding=UTF-8" "-Dcatalina.base=./"]
  :bootclaspath true
  :warn-on-reflection false  
  :ring {:handler ppc.routes/app
         :servlet-path-info? false
         :web-xml "web.xml"
         :init ppc.routes/servlet-init})

