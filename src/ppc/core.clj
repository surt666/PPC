(ns ppc.core
  (:use dynamo4clj.core))

(defn find-pris [kontrakt & varenr]
  (if-not (empty? varenr)
    (find-items "priser" kontrakt false ["eq" (first varenr)])
    (find-items "priser" kontrakt false)))

(defn gem-pris [kontrakt varenr navn pl pgt pg]
  (insert-item "priser" {:kontrakt kontrakt :varenr varenr :navn navn :pg pg :pl pl :pgt pgt}))