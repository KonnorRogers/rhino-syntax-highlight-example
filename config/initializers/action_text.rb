ActiveSupport.on_load :action_text do
  ActionText::ContentHelper.allowed_tags += ["span"]
  ActionText::ContentHelper.allowed_attributes += ["class"]
end
