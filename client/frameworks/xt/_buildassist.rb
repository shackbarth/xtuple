
def detect_modules
  _deferred, _inlined, dirs, base_path = [], [], ["plugins", "xbos"], File.dirname(__FILE__) + "/"
  dirs.each do |path|
    full_path = base_path + path + "/"
    Dir.new(full_path).each do |loadable|
      next unless FileTest.directory?(full_path)
      next unless ![".", ".."].include?(loadable)
      path_to = loadable
      if loadable == "dev"
        _inlined.push(path_to)
      else
        _deferred.push(path_to)
      end
    end  
  end
  return _inlined, _deferred
end