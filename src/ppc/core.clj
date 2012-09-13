(ns ppc.core
  (:use [datomic.api :only [q db] :as d]
        yousee-common.common)
  (:require [http.async.client :as http-client]
            [yousee-common.wddx-if :as wddx]
            [ppc.config :as config]
            [ring.util.codec :as codec]))

(def schema [{:db/id #db/id[:db.part/db]
              :db/ident :produkt
              :db.install/_partition :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :services
              :db.install/_partition :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :plan
              :db.install/_partition :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :kontrakt
              :db.install/_partition :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris
              :db.install/_partition :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :kontrakt/id
              :db/valueType :db.type/string
              :db/unique :db.unique/value
              :db/cardinality :db.cardinality/one              
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :kontrakt/navn
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one              
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :plan/id
              :db/valueType :db.type/string
              :db/unique :db.unique/identity
              :db/cardinality :db.cardinality/one              
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :plan/navn
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one              
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :plan/kontrakter
              :db/valueType :db.type/ref
              :db/cardinality :db.cardinality/many             
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/plan
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/varenr
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/pris
              :db/valueType :db.type/double
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/koda
              :db/valueType :db.type/double
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/copydan
              :db/valueType :db.type/double
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :pris/radiokoda
              :db/valueType :db.type/double
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/varenr
              :db/valueType :db.type/string
              :db/unique :db.unique/value
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/navn
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/fo
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/services
              :db/valueType :db.type/ref
              :db/cardinality :db.cardinality/many            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/pl
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/pgt
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/pg
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/fo
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/salgsstart
              :db/valueType :db.type/instant
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/salgsslut
              :db/valueType :db.type/instant
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/vaegt
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/sorteringsgruppe
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :produkt/sortering
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :service/type
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :service/navn
              :db/valueType :db.type/string
              :db/unique :db.unique/value
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :service/prov-kode
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}

             {:db/id #db/id[:db.part/db]
              :db/ident :service/logistik-kode
              :db/valueType :db.type/string
              :db/cardinality :db.cardinality/one            
              :db.install/_attribute :db.part/db}])

(def uri "datomic:dev://localhost:4334/yousee")

(def conn (delay (d/connect uri)))

(defn create-schema []  
  @(d/transact @conn schema))

(defn insert [l]
  @(d/transact @conn l))

(defn decorate 
  "Simple function to pull out all the attributes of an entity into a map"
  [id & [time]]
  (let [db (if time (d/as-of (d/db @conn) time) (d/db @conn))        
        e (d/entity db id)]
    (select-keys e (keys e))))

;(defrecord Pris [kontrakt varenr pris copydan koda radio-koda])

;(defrecord Produkt [varenr navn fo pl pgt pg vaegt sorteringsgruppe sortering salgsstart salgsslut services])

;(defrecord Service [type id provisionerings-kode logistik-kode])

(defn find-pris [plan & varenr]
  (if-not (empty? varenr)
    (map #(decorate %) (seq (q '[:find ?e :in $ ?p ?v :where [?e :pris/plan ?p] [?e :pris/varenr ?v]] (d/db @conn) plan varenr)))
    (map #(decorate %) (seq (q '[:find ?e :in $ ?p ?v :where [?e :pris/plan ?p]] (d/db @conn) plan)))))

(defn find-alle-planer []
  (map #(decorate %) (seq (q '[:find ?e :where [?e :plan/id]] (d/db @conn)))))

(defn gem-pris [pris]  
  (insert (vector pris)))

(defn gem-produkt [produkt]
  (insert (vector produkt)))

(defn find-produkt [varenr]
  (first (map #(decorate %) (seq (q '[:find ?e :in $ ?v :where [?e :produkt/varenr ?v]] (d/db @conn) varenr)))))

(defn find-alle-produkter []
  (map #(decorate %) (seq (q '[:find ?e :where [?e :produkt/varenr]] (d/db @conn)))))

(defn gem-service [service]
  (insert (vector service)))

(defn find-service [type & navn]
  (if-not (empty? navn)
    (map #(decorate %) (seq (q '[:find ?e :in $ ?t ?n :where [?e :service/type ?t] [?e :service/navn ?n]] (d/db @conn) type navn)))
    (map #(decorate %) (seq (q '[:find ?e :in $ ?t :where [?e :service/type]] (d/db @conn) type)))))

(defn do-aria-call [url]
  (with-open [client (http-client/create-client)]
    (let [response (http-client/POST client url :proxy {:host "sltarray02" :port 8080})]
      (http-client/await response)
      (let [status (:code (http-client/status response))]
        (when (not (= 200 status))
          (do
            (throw (Exception. (str "Unable to connect to Aria, HTTP Status:" status)))))
        (let [stream (java.io.ByteArrayInputStream. (.getBytes (http-client/string response) "UTF-8"))
              wddx-resp (:data (wddx/decode stream))]
          (if (not (= (:error_code wddx-resp) 0))
            (throw (Exception. (str "Aria call failed: " (:error_msg wddx-resp))))
            wddx-resp))))))

(defn generate-query-str [base-url args]
  (str base-url       
       (reduce (fn [s k] (str s "&" (name k) "=" (codec/url-encode (get args k) "UTF-8"))) "" (keys args))))

(defn generate-service-str [args]
  (reduce (fn [s k] (str s "&" (str "service[0][" (name k) "]") "=" (codec/url-encode (get args k) "UTF-8"))) "" (keys args)))

(defn generate-schedule-str [args]
  (loop [a args s ""]
    (if (empty? a)
      s
      (recur (rest a) (str s "&" (str "schedule[" (- (count a) 1) "][schedule_name]") "=" (codec/url-encode (first a) "UTF-8"))))))

(defn generate-amount-str [args]
  (loop [a args s ""]
    (if (empty? a)
      s
      (recur (rest a) (str s "&" (str "schedule[" (- (count a) 1) "][currency_cd]=dkk&service[0][tier][0][schedule][" (- (count a) 1) "][amount]") "=" (codec/url-encode (first a) "UTF-8"))))))

;; (defn create-service [service]
;;   (let [params {:rest_call  "create_service"
;;                 :service_name (:navn service)
;;                 :service_type "Recurring"
;;                 :gl_cd "12345"
;;                 :taxable_ind "0"}
;;         url (generate-query-str config/aria-admin-api-url params)]
;;     (do-aria-call url)))

(defn create-plan [varenr]
  ;;TODO find produkt
  (let [plan {:navn "test"}
        params {:rest_call  "create_new_plan"
                :plan_name (:navn plan)
                :plan_type "Supplemental Recurring Plan"
                :currency "dkk"
                :billing_interval "1"
                :active "1"
                :rollover_months "0"
                :dunning_plan_no "25609"}
        purl (generate-query-str config/aria-admin-api-url params)
        service {:name (:navn plan)
                 :service_type "Recurring"
                 :gl_cd "174294792"
                 :taxable_ind "1"
                 :rate_type "Flat Rate"}
        surl (generate-service-str service)        
        aurl (generate-amount-str ["100" "90"])
        schurl (generate-schedule-str ["yousee" "KAB"])
        url (str purl "&plan_group[]=1&" surl schurl aurl "&parent_plans[]=10263079")]
    (prn url)
    (do-aria-call url)))
