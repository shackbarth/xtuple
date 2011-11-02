
Postbooks.mainPage = XT.BasePage.design({

  basePane: XT.MainPane.design({

    childViews: "loadingBlock".w(),

    loadingBlock: XT.View.design({

      layout: { height: 200, width: 400, centerX: 0, centerY: 0 },

      classNames: "loading-block-container".w(),

      childViews: "partsBlock messageBlock".w(),

      partsBlock: XT.View.design({
        
        layout: { height: 100, top: 0, left: 0, right: 0 },

        classNames: "loading-parts-block-container".w(),

        childViews: "configuring registering records user login".w(),

        configuring: XT.StatusImageView.design({
          
          layout: { height: 64, width: 64, centerY: 0, left: 10 },

          classNames: "loading-parts-configuring".w(),

          imageClass: "configuring-image"

        }),

        registering: XT.StatusImageView.design({
          
          layout: { height: 64, width: 64, centerY: 0, left: 84 },

          classNames: "loading-parts-registering".w(),

          imageClass: "registering-image"

        }),

        records: XT.StatusImageView.design({
          
          layout: { height: 64, width: 64, centerY: 0, left: 158 },

          classNames: "loading-parts-records".w(),

          imageClass: "records-image"

        }),

        user: XT.StatusImageView.design({

          layout: { height: 64, width: 64, centerY: 0, left: 232 },

          classNames: "loading-parts-user".w(),

          imageClass: "user-image"

        }),

        login: XT.StatusImageView.design({

          layout: { height: 64, width: 64, centerY: 0, left: 306 },

          classNames: "loading-parts-login".w(),

          imageClass: "login-image"

        })

      }),

      messageBlock: XT.View.design({

        layout: { height: 100, bottom: 0, left: 0, right: 0 },

        classNames: "loading-message-block-container".w(),
      
        childViews: "message".w(),

        message: SC.LabelView.design({
      
          layout: { left: 0, right: 0, height: 25, centerY: 0 },

          tagName: "H3",

          valueBinding: SC.Binding.from("XT.MessageController.loadingStatus").oneWay(),

          icon: "loading-icon"
        })

      })

    })

  })

}) ;
