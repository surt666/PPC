(ns ppc.core
  (:use dynamo4clj.core)
  (:require [http.async.client :as http-client]
            [yousee-common.wddx-if :as wddx]
            [ppc.config :as config]
            [ring.util.codec :as codec]))

(defrecord Pris [kontrakt varenr pris copydan koda radio-koda])

(defrecord Produkt [varenr navn fo pl pgt pg vaegt sorteringsgruppe sortering salgsstart salgsslut services])

(defrecord Service [type id provisionerings-kode logistik-kode])

(defn find-pris [kontrakt & varenr]
  (if-not (empty? varenr)
    (find-items "priser" kontrakt false ["eq" (first varenr)])
    (find-items "priser" kontrakt false)))

(defn gem-pris [pris]  
  (try
    (let [tpris {:kontrakt (:kontrakt pris) :varenr (:varenr pris) :pris (:pris pris) :copydan (:copydan pris)
                :koda (:koda pris) :radio-koda (:radio-koda pris) :moms (str (* 0.25 (Double/parseDouble (:pris pris))))
                :totalpris (str (+ (Double/parseDouble (:pris pris)) (Double/parseDouble (:copydan pris)) (Double/parseDouble (:koda pris)) (Double/parseDouble (:radio-koda pris)) (* 0.25 (Double/parseDouble (:pris pris)))))}]    
      (insert-item "priser" tpris)
      tpris)
    (catch Exception e
      nil)))

(defn gem-produkt [produkt]
  (try
    (insert-item "produkter" produkt)
    produkt
    (catch Exception e
      nil)))

(defn find-produkt [varenr]
  (get-item "produkter" varenr))

(defn find-alle-produkter []
  (scan "produkter"))

(defn gem-service [service]
  (try
    (insert-item "services" service)
    service
    (catch Exception e
      nil)))

(defn find-service [type & id]
  (if-not (empty? id)
    (find-items "services" type false ["eq" (first id)])
    (find-items "services" type false)))

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

(defn create-service [service]
  (let [params {:rest_call  "create_service"
                :service_name (:navn service)
                :service_type "Recurring"
                :gl_cd "12345"
                :taxable_ind "0"}
        url (generate-query-str config/aria-admin-api-url params)]
    (do-aria-call url)))

(defn create-plan [plan]
  (let [params {:rest_call  "create_new_plan"
                :plan_name (:navn plan)
                :plan_type "Supplemental Recurring Plan"
                :currency "dkk"
                :billing_interval "3"
                :active "1"
                :rollover_months "0"
                :dunning_plan_no "25609"}
        purl (generate-query-str config/aria-admin-api-url params)
        service {:name (:navn plan)
                 :service_type "Recurring"
                 :gl_cd "174294792"
                 :taxable_ind "0"
                 :rate_type "Flat Rate"}
        surl (generate-service-str service)        
        aurl (generate-amount-str ["100" "90"])
        schurl (generate-schedule-str ["yousee" "KAB"])
        url (str purl surl schurl aurl "&parent_plans[]=10263079")]
    (prn url)
    (do-aria-call url)))
