
config :postbooks,
	:required => [ :sproutcore, "sproutcore/animation", :xt ]

proxy '/datasource/', :url => '/', :to => 'localhost:7000'
