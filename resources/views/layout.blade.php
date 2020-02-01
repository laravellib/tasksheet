<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true )}}">
    @if($user->todosheetSubscription->type === 'TRIAL')
      <script src="https://js.stripe.com/v3/"></script>
    @endif
    <title>to-dosheet</title>
  </head>
  <body>
    <section id="react-container"></section>
    <script>
      const environment = {
        assetUrl: "{{ asset('') }}",
        s3Bucket: "{{ env('AWS_BUCKET') }}"
      }
      const initialData = {
        user: @json($user),
        files: @json($files),
        folders: @json($folders),
      }
    </script>
    @yield('react-script')
  </body>
</html>