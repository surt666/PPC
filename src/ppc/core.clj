(ns ppc.core
  (:use dynamo4clj.core))

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